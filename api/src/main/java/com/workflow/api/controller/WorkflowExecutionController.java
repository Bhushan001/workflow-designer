package com.workflow.api.controller;

import com.workflow.api.dto.*;
import com.workflow.api.service.ExecutionEngineService;
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
    
    @PostMapping("/execute")
    public ResponseEntity<ExecutionResult> executeWorkflow(@RequestBody ExecutionRequest request) {
        try {
            log.info("Executing workflow with {} nodes and {} edges", 
                request.getNodes().size(), request.getEdges().size());
            
            ExecutionResult result = executionEngineService.execute(
                request.getNodes(), 
                request.getEdges()
            );
            
            log.info("Workflow execution completed. Run ID: {}, Results: {}", 
                result.getRunId(), result.getResults().size());
            
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            log.error("Workflow execution validation failed", e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Workflow execution failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/execute/node")
    public ResponseEntity<NodeRunResult> executeSingleNode(@RequestBody SingleNodeExecutionRequest request) {
        try {
            log.info("Executing single node: {}", request.getNode().getId());
            
            NodeRunResult result = executionEngineService.executeSingleNode(request.getNode());
            
            log.info("Node execution completed. Node ID: {}, Status: {}", 
                result.getNodeId(), result.getStatus());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Node execution failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
