package com.workflow.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.workflow.api.dto.WorkflowDefinition;
import com.workflow.api.entity.Workflow;
import com.workflow.api.exception.WorkflowNotFoundException;
import com.workflow.api.service.WorkflowService;
import com.workflow.model.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<ApiResponse<Workflow>> createWorkflow(
            @RequestBody java.util.Map<String, Object> request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        log.info("Creating workflow for user: {}", userId);
        
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
        
        ApiResponse<Workflow> response = new ApiResponse<>(
            HttpStatus.CREATED.value(),
            "Workflow created successfully",
            created
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Get workflow by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Workflow>> getWorkflowById(@PathVariable String id) {
        log.info("Getting workflow by ID: {}", id);
        
        Workflow workflow = workflowService.getWorkflowById(id)
                .orElseThrow(() -> new WorkflowNotFoundException("Workflow with id '" + id + "' not found"));
        
        ApiResponse<Workflow> response = new ApiResponse<>(
            HttpStatus.OK.value(),
            "Success",
            workflow
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get all workflows for current user
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Workflow>>> getAllWorkflows(
            @PageableDefault(size = 10, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        log.info("Getting workflows for user: {}, search: {}", userId, search);
        
        String ownerId = userId != null ? userId : "default-user";
        
        Page<Workflow> workflowsPage;
        if (search != null && !search.trim().isEmpty()) {
            workflowsPage = workflowService.searchWorkflowsByOwner(ownerId, search, pageable);
        } else {
            workflowsPage = workflowService.getAllWorkflowsByOwner(ownerId, pageable);
        }
        
        ApiResponse<Page<Workflow>> response = new ApiResponse<>(
            HttpStatus.OK.value(),
            "Success",
            workflowsPage
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Update workflow
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Workflow>> updateWorkflow(
            @PathVariable String id,
            @RequestBody java.util.Map<String, Object> request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        log.info("Updating workflow: {} for user: {}", id, userId);
        
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
        
        ApiResponse<Workflow> response = new ApiResponse<>(
            HttpStatus.OK.value(),
            "Workflow updated successfully",
            updated
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Delete workflow
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteWorkflow(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        log.info("Deleting workflow: {} for user: {}", id, userId);
        
        String ownerId = userId != null ? userId : "default-user";
        workflowService.deleteWorkflow(id, ownerId);
        
        ApiResponse<String> response = new ApiResponse<>(
            HttpStatus.OK.value(),
            "Workflow deleted successfully",
            "Workflow with id '" + id + "' has been deleted"
        );
        
        return ResponseEntity.ok(response);
    }
}
