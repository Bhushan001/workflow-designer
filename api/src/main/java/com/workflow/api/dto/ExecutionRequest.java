package com.workflow.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionRequest {
    private List<WorkflowNode> nodes;
    private List<WorkflowEdge> edges;
}
