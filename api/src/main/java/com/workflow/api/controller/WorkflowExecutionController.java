package com.workflow.api.controller;

import com.workflow.api.dto.*;
import com.workflow.api.exception.WorkflowExecutionException;
import com.workflow.api.service.ExecutionEngineService;
import com.workflow.api.service.WorkflowService;
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
    private final WorkflowService workflowService;
    
    /**
     * Execute workflow by ID (loads from database)
     */
    @PostMapping("/{id}/execute")
    public ResponseEntity<Map<String, Object>> executeWorkflowById(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        try {
            log.info("Executing workflow by ID: {}", id);
            
            // Load workflow from database
            com.workflow.api.entity.Workflow workflowEntity = workflowService.getWorkflowById(id)
                    .orElseThrow(() -> new WorkflowExecutionException("Workflow with id '" + id + "' not found"));
            
            // Check authorization (optional - can be enhanced with @PreAuthorize)
            if (userId != null && !workflowEntity.getOwnerId().equals(userId)) {
                Map<String, Object> error = new HashMap<>();
                error.put("statusCode", HttpStatus.FORBIDDEN.value());
                error.put("message", "You do not have permission to execute this workflow");
                error.put("errorCode", "ACCESS_DENIED");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }
            
            // Parse workflow definition
            WorkflowDefinition workflowDefinition = workflowService.toWorkflowDefinition(workflowEntity);
            
            if (workflowDefinition.getNodes() == null || workflowDefinition.getNodes().isEmpty()) {
                throw new WorkflowExecutionException("Workflow definition is empty or invalid");
            }
            
            // Execute workflow
            ExecutionResult result = executionEngineService.execute(
                    workflowDefinition.getNodes(),
                    workflowDefinition.getEdges() != null ? workflowDefinition.getEdges() : java.util.Collections.emptyList()
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
    
    /**
     * Execute workflow with provided definition (for testing/ad-hoc execution)
     */
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
