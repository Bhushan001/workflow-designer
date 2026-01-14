package com.workflow.api.service;

import com.workflow.api.dto.*;
import com.workflow.api.service.runners.*;
import com.workflow.api.util.TopologicalSort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExecutionEngineService {
    
    private final TriggerNodeRunner triggerNodeRunner;
    private final HttpNodeRunner httpNodeRunner;
    private final ConditionNodeRunner conditionNodeRunner;
    private final DoNothingNodeRunner doNothingNodeRunner;
    private final CodeNodeRunner codeNodeRunner;
    
    public ExecutionResult execute(List<WorkflowNode> nodes, List<WorkflowEdge> edges) {
        String runId = "run-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
        ExecutionContext context = new ExecutionContext(runId);
        
        // Validate workflow
        String validationError = validateWorkflow(nodes);
        if (validationError != null) {
            throw new IllegalArgumentException(validationError);
        }
        
        // Topological sort
        TopologicalSort.Result sortResult = TopologicalSort.sort(nodes, edges);
        if (sortResult.isHasCycle()) {
            throw new IllegalArgumentException("Cycle detected in workflow graph");
        }
        
        List<WorkflowNode> sorted = sortResult.getSorted();
        
        // Find trigger node
        WorkflowNode triggerNode = sorted.stream()
            .filter(n -> "TRIGGER".equals(n.getType()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("No trigger node found"));
        
        List<NodeRunResult> results = new ArrayList<>();
        
        // Execute nodes in topological order
        for (WorkflowNode node : sorted) {
            ExecutionSnapshot snapshot = context.snapshot();
            
            // Check if node should execute
            if (!shouldExecuteNode(node, edges, context)) {
                NodeRunResult skipped = new NodeRunResult(
                    node.getId(),
                    new HashMap<>(),
                    "skipped",
                    null,
                    Instant.now().toString()
                );
                context.addNodeResult(skipped);
                results.add(skipped);
                continue;
            }
            
            // Execute node
            NodeRunResult result = executeNode(node, snapshot);
            context.addNodeResult(result);
            results.add(result);
            
            // Stop execution if node failed
            if ("failed".equals(result.getStatus())) {
                break;
            }
        }
        
        return new ExecutionResult(runId, results);
    }
    
    public NodeRunResult executeSingleNode(WorkflowNode node) {
        ExecutionContext context = new ExecutionContext("test-" + System.currentTimeMillis());
        ExecutionSnapshot snapshot = context.snapshot();
        return executeNode(node, snapshot);
    }
    
    private NodeRunResult executeNode(WorkflowNode node, ExecutionSnapshot snapshot) {
        String nodeType = node.getType();
        
        return switch (nodeType) {
            case "TRIGGER" -> triggerNodeRunner.run(node, snapshot);
            case "HTTP_REQUEST" -> httpNodeRunner.run(node, snapshot);
            case "CONDITION" -> conditionNodeRunner.run(node, snapshot);
            case "DO_NOTHING" -> doNothingNodeRunner.run(node, snapshot);
            case "CODE" -> codeNodeRunner.run(node, snapshot);
            default -> new NodeRunResult(
                node.getId(),
                new HashMap<>(),
                "failed",
                "Unknown node type: " + nodeType,
                Instant.now().toString()
            );
        };
    }
    
    private boolean shouldExecuteNode(WorkflowNode node, List<WorkflowEdge> edges, ExecutionContext context) {
        List<WorkflowEdge> incomingEdges = edges.stream()
            .filter(e -> e.getTarget().equals(node.getId()))
            .collect(Collectors.toList());
        
        if (incomingEdges.isEmpty()) {
            return true;
        }
        
        for (WorkflowEdge edge : incomingEdges) {
            Map<String, Object> sourceOutputs = context.getNodeOutputs().get(edge.getSource());
            if (sourceOutputs == null) {
                return false;
            }
            
            // Check for conditional branching
            if (sourceOutputs.containsKey("branch")) {
                String expectedBranch = edge.getSourceHandle() != null ? edge.getSourceHandle() : "true";
                Object actualBranch = sourceOutputs.get("branch");
                if (!expectedBranch.equals(String.valueOf(actualBranch))) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    private String validateWorkflow(List<WorkflowNode> nodes) {
        long triggerCount = nodes.stream()
            .filter(n -> "TRIGGER".equals(n.getType()))
            .count();
        
        if (triggerCount == 0) {
            return "Workflow must have at least one Trigger node";
        }
        
        for (WorkflowNode node : nodes) {
            String nodeType = node.getType();
            if ("HTTP_REQUEST".equals(nodeType)) {
                Map<String, Object> config = node.getData().getConfig();
                String url = (String) config.get("url");
                if (url == null || url.trim().isEmpty()) {
                    return "HTTP_REQUEST node " + node.getId() + " must have a URL";
                }
            }
            
            if ("CONDITION".equals(nodeType)) {
                Map<String, Object> config = node.getData().getConfig();
                String expression = (String) config.get("expression");
                if (expression == null || expression.trim().isEmpty()) {
                    return "Condition node " + node.getId() + " must have an expression";
                }
            }
        }
        
        return null;
    }
}
