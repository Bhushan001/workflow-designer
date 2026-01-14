package com.techie.rapid.designer.service;

import com.techie.rapid.dto.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class UserClientService {

    @Autowired
    private RestTemplate restTemplate;

    public UserDto getUserById(UUID userId) {
        // Replace with your User microservice URL
        String jwtToken = getJwtTokenFromContext();
        String userMicroserviceUrl = "http://localhost:8081/api/users";
        String url = userMicroserviceUrl + "/" + userId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + jwtToken); // Add the JWT token

        HttpEntity<String> entity = new HttpEntity<>(headers); // Create an HttpEntity with the headers

        ResponseEntity<UserDto> response = restTemplate.exchange(url, HttpMethod.GET, entity, UserDto.class);
        return response.getBody();// Use exchange
    }

    private String getJwtTokenFromContext() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String authHeader = (String) request.getAttribute("authorizationHeader");
            if (authHeader != null) {
                return authHeader;
            }
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No JWT token found");
    }
}