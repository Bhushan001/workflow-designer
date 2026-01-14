package com.workflow.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionResult {
    private String runId;
    private List<NodeRunResult> results;
}
