package com.workflow.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.workflow.api.dto.WorkflowDefinition;
import com.workflow.api.entity.Workflow;
import com.workflow.api.service.WorkflowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/workflows")
@RequiredArgsConstructor
public class WorkflowController {
    
    private final WorkflowService workflowService;
    
    /**
     * Create a new workflow
     * Expects: { name, description?, workflowDefinition, clientId?, status? }
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createWorkflow(
            @RequestBody Map<String, Object> request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        try {
            // Extract owner ID from header or use a default (for now)
            String ownerId = userId != null ? userId : "default-user";
            
            Workflow workflow = new Workflow();
            workflow.setName((String) request.get("name"));
            workflow.setDescription((String) request.get("description"));
            workflow.setClientId((String) request.get("clientId"));
            workflow.setStatus((String) request.getOrDefault("status", "DRAFT"));
            
            // Convert workflowDefinition to JSON string
            if (request.get("workflowDefinition") != null) {
                ObjectMapper mapper = new ObjectMapper();
                try {
                    String workflowDefJson = mapper.writeValueAsString(request.get("workflowDefinition"));
                    workflow.setWorkflowDefinition(workflowDefJson);
                } catch (Exception e) {
                    log.error("Error serializing workflow definition", e);
                    throw new IllegalArgumentException("Invalid workflow definition format");
                }
            }
            
            Workflow created = workflowService.createWorkflow(workflow, ownerId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("statusCode", HttpStatus.CREATED.value());
            response.put("message", "Workflow created successfully");
            response.put("data", created);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.error("Validation error creating workflow", e);
            Map<String, Object> error = new HashMap<>();
            error.put("statusCode", HttpStatus.BAD_REQUEST.value());
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            log.error("Error creating workflow", e);
            Map<String, Object> error = new HashMap<>();
            error.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
            error.put("message", "Failed to create workflow");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Get workflow by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getWorkflowById(@PathVariable String id) {
        try {
            Optional<Workflow> workflow = workflowService.getWorkflowById(id);
            if (workflow.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("statusCode", HttpStatus.OK.value());
                response.put("message", "Success");
                response.put("data", workflow.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("statusCode", HttpStatus.NOT_FOUND.value());
                error.put("message", "Workflow not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            log.error("Error getting workflow", e);
            Map<String, Object> error = new HashMap<>();
            error.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
            error.put("message", "Failed to get workflow");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Get all workflows for current user
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllWorkflows(
            @PageableDefault(size = 10, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        try {
            String ownerId = userId != null ? userId : "default-user";
            
            Page<Workflow> workflowsPage;
            if (search != null && !search.trim().isEmpty()) {
                workflowsPage = workflowService.searchWorkflowsByOwner(ownerId, search, pageable);
            } else {
                workflowsPage = workflowService.getAllWorkflowsByOwner(ownerId, pageable);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("statusCode", HttpStatus.OK.value());
            response.put("message", "Success");
            response.put("data", workflowsPage);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting workflows", e);
            Map<String, Object> error = new HashMap<>();
            error.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
            error.put("message", "Failed to get workflows");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Update workflow
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateWorkflow(
            @PathVariable String id,
            @RequestBody Map<String, Object> request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        try {
            String ownerId = userId != null ? userId : "default-user";
            
            Workflow workflowDetails = new Workflow();
            workflowDetails.setName((String) request.get("name"));
            workflowDetails.setDescription((String) request.get("description"));
            workflowDetails.setClientId((String) request.get("clientId"));
            workflowDetails.setStatus((String) request.get("status"));
            
            // Convert workflowDefinition to JSON string
            if (request.get("workflowDefinition") != null) {
                ObjectMapper mapper = new ObjectMapper();
                try {
                    String workflowDefJson = mapper.writeValueAsString(request.get("workflowDefinition"));
                    workflowDetails.setWorkflowDefinition(workflowDefJson);
                } catch (Exception e) {
                    log.error("Error serializing workflow definition", e);
                    throw new IllegalArgumentException("Invalid workflow definition format");
                }
            }
            
            Workflow updated = workflowService.updateWorkflow(id, workflowDetails, ownerId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("statusCode", HttpStatus.OK.value());
            response.put("message", "Workflow updated successfully");
            response.put("data", updated);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Validation error updating workflow", e);
            Map<String, Object> error = new HashMap<>();
            error.put("statusCode", HttpStatus.BAD_REQUEST.value());
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            log.error("Error updating workflow", e);
            Map<String, Object> error = new HashMap<>();
            error.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
            error.put("message", "Failed to update workflow");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Delete workflow
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteWorkflow(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        try {
            String ownerId = userId != null ? userId : "default-user";
            workflowService.deleteWorkflow(id, ownerId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("statusCode", HttpStatus.OK.value());
            response.put("message", "Workflow deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Validation error deleting workflow", e);
            Map<String, Object> error = new HashMap<>();
            error.put("statusCode", HttpStatus.BAD_REQUEST.value());
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            log.error("Error deleting workflow", e);
            Map<String, Object> error = new HashMap<>();
            error.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
            error.put("message", "Failed to delete workflow");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
