package com.workflow.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionSnapshot {
    private Map<String, Map<String, Object>> nodeOutputs;
    private String runId;
    private String startTime;
}
