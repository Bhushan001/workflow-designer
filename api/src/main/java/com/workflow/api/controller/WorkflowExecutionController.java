package com.workflow.api.controller;

import com.workflow.api.dto.*;
import com.workflow.api.exception.WorkflowExecutionException;
import com.workflow.api.service.ExecutionEngineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/workflows")
@RequiredArgsConstructor
public class WorkflowExecutionController {
    
    private final ExecutionEngineService executionEngineService;
    
    @PostMapping("/execute")
    public ResponseEntity<Map<String, Object>> executeWorkflow(@RequestBody ExecutionRequest request) {
        try {
            log.info("Executing workflow with {} nodes and {} edges", 
                request.getNodes().size(), request.getEdges().size());
            
            ExecutionResult result = executionEngineService.execute(
                request.getNodes(), 
                request.getEdges()
            );
            
            log.info("Workflow execution completed. Run ID: {}, Results: {}", 
                result.getRunId(), result.getResults().size());
            
            Map<String, Object> response = new HashMap<>();
            response.put("statusCode", HttpStatus.OK.value());
            response.put("message", "Workflow executed successfully");
            response.put("data", result);
            
            return ResponseEntity.ok(response);
        } catch (WorkflowExecutionException e) {
            log.error("Workflow execution validation failed: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("statusCode", HttpStatus.BAD_REQUEST.value());
            error.put("message", e.getMessage());
            error.put("errorCode", "WORKFLOW_EXECUTION_ERROR");
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            log.error("Workflow execution failed", e);
            Map<String, Object> error = new HashMap<>();
            error.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
            error.put("message", "Workflow execution failed: " + e.getMessage());
            error.put("errorCode", "INTERNAL_SERVER_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @PostMapping("/execute/node")
    public ResponseEntity<Map<String, Object>> executeSingleNode(@RequestBody SingleNodeExecutionRequest request) {
        try {
            log.info("Executing single node: {}", request.getNode().getId());
            
            NodeRunResult result = executionEngineService.executeSingleNode(request.getNode());
            
            log.info("Node execution completed. Node ID: {}, Status: {}", 
                result.getNodeId(), result.getStatus());
            
            Map<String, Object> response = new HashMap<>();
            response.put("statusCode", HttpStatus.OK.value());
            response.put("message", "Node executed successfully");
            response.put("data", result);
            
            return ResponseEntity.ok(response);
        } catch (WorkflowExecutionException e) {
            log.error("Node execution validation failed: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("statusCode", HttpStatus.BAD_REQUEST.value());
            error.put("message", e.getMessage());
            error.put("errorCode", "NODE_EXECUTION_ERROR");
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            log.error("Node execution failed", e);
            Map<String, Object> error = new HashMap<>();
            error.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
            error.put("message", "Node execution failed: " + e.getMessage());
            error.put("errorCode", "INTERNAL_SERVER_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
