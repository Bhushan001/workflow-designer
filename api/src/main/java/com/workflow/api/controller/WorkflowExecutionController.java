package com.workflow.api.controller;

import com.workflow.api.dto.*;
import com.workflow.api.exception.*;
import com.workflow.api.service.ExecutionEngineService;
import com.workflow.api.service.WorkflowService;
import com.workflow.model.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<ApiResponse<ExecutionResult>> executeWorkflowById(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        log.info("Executing workflow by ID: {} for user: {}", id, userId);
        
        // Load workflow from database
        com.workflow.api.entity.Workflow workflowEntity = workflowService.getWorkflowById(id)
                .orElseThrow(() -> new WorkflowNotFoundException("Workflow with id '" + id + "' not found"));
        
        // Check authorization
        if (userId != null && !workflowEntity.getOwnerId().equals(userId)) {
            throw new WorkflowAccessDeniedException("You do not have permission to execute this workflow");
        }
        
        // Parse workflow definition
        WorkflowDefinition workflowDefinition = workflowService.toWorkflowDefinition(workflowEntity);
        
        if (workflowDefinition.getNodes() == null || workflowDefinition.getNodes().isEmpty()) {
            throw new WorkflowValidationException("Workflow definition is empty or invalid");
        }
        
        // Execute workflow
        ExecutionResult result = executionEngineService.execute(
                workflowDefinition.getNodes(),
                workflowDefinition.getEdges() != null ? workflowDefinition.getEdges() : java.util.Collections.emptyList()
        );
        
        log.info("Workflow execution completed. Run ID: {}, Results: {}", 
                result.getRunId(), result.getResults().size());
        
        ApiResponse<ExecutionResult> response = new ApiResponse<>(
            HttpStatus.OK.value(),
            "Workflow executed successfully",
            result
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Execute workflow with provided definition (for testing/ad-hoc execution)
     */
    @PostMapping("/execute")
    public ResponseEntity<ApiResponse<ExecutionResult>> executeWorkflow(@RequestBody ExecutionRequest request) {
        log.info("Executing workflow with {} nodes and {} edges", 
            request.getNodes().size(), request.getEdges().size());
        
        ExecutionResult result = executionEngineService.execute(
            request.getNodes(), 
            request.getEdges()
        );
        
        log.info("Workflow execution completed. Run ID: {}, Results: {}", 
            result.getRunId(), result.getResults().size());
        
        ApiResponse<ExecutionResult> response = new ApiResponse<>(
            HttpStatus.OK.value(),
            "Workflow executed successfully",
            result
        );
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/execute/node")
    public ResponseEntity<ApiResponse<NodeRunResult>> executeSingleNode(@RequestBody SingleNodeExecutionRequest request) {
        log.info("Executing single node: {}", request.getNode().getId());
        
        NodeRunResult result = executionEngineService.executeSingleNode(request.getNode());
        
        log.info("Node execution completed. Node ID: {}, Status: {}", 
            result.getNodeId(), result.getStatus());
        
        ApiResponse<NodeRunResult> response = new ApiResponse<>(
            HttpStatus.OK.value(),
            "Node executed successfully",
            result
        );
        
        return ResponseEntity.ok(response);
    }
}
