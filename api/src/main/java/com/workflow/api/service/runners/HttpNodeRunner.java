package com.workflow.api.service.runners;

import com.workflow.api.dto.ExecutionSnapshot;
import com.workflow.api.dto.NodeRunResult;
import com.workflow.api.dto.WorkflowNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class HttpNodeRunner implements NodeRunner {
    
    private final RestTemplate restTemplate;
    
    public HttpNodeRunner(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    @Override
    public NodeRunResult run(WorkflowNode node, ExecutionSnapshot snapshot) {
        Map<String, Object> config = node.getData().getConfig();
        String url = (String) config.get("url");
        
        if (url == null || url.trim().isEmpty()) {
            return new NodeRunResult(
                node.getId(),
                new HashMap<>(),
                "failed",
                "URL is required",
                Instant.now().toString()
            );
        }
        
        String method = (String) config.getOrDefault("method", "POST");
        Integer timeoutMs = (Integer) config.getOrDefault("timeoutMs", 30000);
        
        @SuppressWarnings("unchecked")
        Map<String, String> headers = (Map<String, String>) config.getOrDefault("headers", new HashMap<>());
        @SuppressWarnings("unchecked")
        Map<String, String> query = (Map<String, String>) config.getOrDefault("query", new HashMap<>());
        Object body = config.get("body");
        
        try {
            HttpHeaders httpHeaders = new HttpHeaders();
            headers.forEach(httpHeaders::set);
            if (!httpHeaders.containsKey(HttpHeaders.CONTENT_TYPE)) {
                httpHeaders.setContentType(MediaType.APPLICATION_JSON);
            }
            
            // Build URL with query parameters
            String fullUrl = url;
            if (!query.isEmpty()) {
                StringBuilder queryString = new StringBuilder();
                query.forEach((key, value) -> {
                    if (queryString.length() > 0) {
                        queryString.append("&");
                    }
                    queryString.append(key).append("=").append(value);
                });
                fullUrl = url + (url.contains("?") ? "&" : "?") + queryString;
            }
            
            HttpEntity<Object> requestEntity = new HttpEntity<>(body, httpHeaders);
            ResponseEntity<Object> response;
            
            switch (method.toUpperCase()) {
                case "GET":
                    response = restTemplate.exchange(fullUrl, HttpMethod.GET, requestEntity, Object.class);
                    break;
                case "POST":
                    response = restTemplate.exchange(fullUrl, HttpMethod.POST, requestEntity, Object.class);
                    break;
                case "PUT":
                    response = restTemplate.exchange(fullUrl, HttpMethod.PUT, requestEntity, Object.class);
                    break;
                case "PATCH":
                    response = restTemplate.exchange(fullUrl, HttpMethod.PATCH, requestEntity, Object.class);
                    break;
                case "DELETE":
                    response = restTemplate.exchange(fullUrl, HttpMethod.DELETE, requestEntity, Object.class);
                    break;
                default:
                    return new NodeRunResult(
                        node.getId(),
                        new HashMap<>(),
                        "failed",
                        "Unsupported HTTP method: " + method,
                        Instant.now().toString()
                    );
            }
            
            Map<String, Object> outputs = new HashMap<>();
            Map<String, Object> requestInfo = new HashMap<>();
            requestInfo.put("url", url);
            requestInfo.put("method", method);
            requestInfo.put("headers", headers);
            requestInfo.put("query", query);
            requestInfo.put("body", body);
            requestInfo.put("timeoutMs", timeoutMs);
            
            Map<String, Object> responseInfo = new HashMap<>();
            HttpStatusCode statusCode = response.getStatusCode();
            responseInfo.put("status", statusCode.value());
            // Get status text - HttpStatus has getReasonPhrase(), otherwise use default
            String statusText = statusCode instanceof HttpStatus 
                ? ((HttpStatus) statusCode).getReasonPhrase() 
                : "OK";
            responseInfo.put("statusText", statusText);
            responseInfo.put("data", response.getBody());
            
            Map<String, String> responseHeaders = new HashMap<>();
            response.getHeaders().forEach((key, values) -> {
                if (!values.isEmpty()) {
                    responseHeaders.put(key, values.get(0));
                }
            });
            responseInfo.put("headers", responseHeaders);
            
            outputs.put("request", requestInfo);
            outputs.put("response", responseInfo);
            outputs.put("snapshot", snapshot);
            
            return new NodeRunResult(
                node.getId(),
                outputs,
                "success",
                null,
                Instant.now().toString()
            );
            
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            return createErrorResult(node, snapshot, url, method, headers, query, body, timeoutMs, 
                e.getStatusCode().value(), e.getStatusText(), e.getResponseBodyAsString());
        } catch (RestClientException e) {
            return createErrorResult(node, snapshot, url, method, headers, query, body, timeoutMs, 
                0, e.getMessage(), null);
        }
    }
    
    private NodeRunResult createErrorResult(WorkflowNode node, ExecutionSnapshot snapshot, 
                                          String url, String method, Map<String, String> headers,
                                          Map<String, String> query, Object body, Integer timeoutMs,
                                          int statusCode, String statusText, String responseData) {
        Map<String, Object> outputs = new HashMap<>();
        Map<String, Object> requestInfo = new HashMap<>();
        requestInfo.put("url", url);
        requestInfo.put("method", method);
        requestInfo.put("headers", headers);
        requestInfo.put("query", query);
        requestInfo.put("body", body);
        requestInfo.put("timeoutMs", timeoutMs);
        
        Map<String, Object> responseInfo = new HashMap<>();
        responseInfo.put("status", statusCode);
        responseInfo.put("statusText", statusText);
        responseInfo.put("data", responseData);
        responseInfo.put("error", statusText);
        
        outputs.put("request", requestInfo);
        outputs.put("response", responseInfo);
        outputs.put("snapshot", snapshot);
        
        return new NodeRunResult(
            node.getId(),
            outputs,
            "failed",
            statusText,
            Instant.now().toString()
        );
    }
}
