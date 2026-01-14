package com.workflow.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NodeRunResult {
    private String nodeId;
    private Map<String, Object> outputs;
    private String status; // success, failed, skipped
    private String error;
    private String timestamp;
}
