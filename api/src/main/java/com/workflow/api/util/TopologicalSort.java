package com.workflow.api.util;

import com.workflow.api.dto.WorkflowEdge;
import com.workflow.api.dto.WorkflowNode;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.*;

public class TopologicalSort {
    
    @Data
    @AllArgsConstructor
    public static class Result {
        private List<WorkflowNode> sorted;
        private boolean hasCycle;
    }

    public static Result sort(List<WorkflowNode> nodes, List<WorkflowEdge> edges) {
        Map<String, WorkflowNode> nodeMap = new HashMap<>();
        Map<String, Integer> inDegree = new HashMap<>();
        Map<String, List<String>> adjacencyList = new HashMap<>();

        // Initialize maps
        for (WorkflowNode node : nodes) {
            nodeMap.put(node.getId(), node);
            inDegree.put(node.getId(), 0);
            adjacencyList.put(node.getId(), new ArrayList<>());
        }

        // Build adjacency list and calculate in-degrees
        for (WorkflowEdge edge : edges) {
            List<String> sourceList = adjacencyList.get(edge.getSource());
            sourceList.add(edge.getTarget());
            adjacencyList.put(edge.getSource(), sourceList);

            inDegree.put(edge.getTarget(), inDegree.get(edge.getTarget()) + 1);
        }

        // Kahn's algorithm for topological sort
        Queue<String> queue = new LinkedList<>();
        List<WorkflowNode> sorted = new ArrayList<>();

        // Find all nodes with in-degree 0
        for (Map.Entry<String, Integer> entry : inDegree.entrySet()) {
            if (entry.getValue() == 0) {
                queue.offer(entry.getKey());
            }
        }

        int processedCount = 0;

        while (!queue.isEmpty()) {
            String nodeId = queue.poll();
            WorkflowNode node = nodeMap.get(nodeId);
            if (node != null) {
                sorted.add(node);
                processedCount++;
            }

            List<String> neighbors = adjacencyList.get(nodeId);
            if (neighbors != null) {
                for (String neighborId : neighbors) {
                    int currentInDegree = inDegree.get(neighborId);
                    inDegree.put(neighborId, currentInDegree - 1);

                    if (inDegree.get(neighborId) == 0) {
                        queue.offer(neighborId);
                    }
                }
            }
        }

        // If processed count is less than total nodes, there's a cycle
        boolean hasCycle = processedCount < nodes.size();

        return new Result(sorted, hasCycle);
    }
}
