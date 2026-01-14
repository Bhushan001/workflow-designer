package com.workflow.api.service;

import com.workflow.api.dto.ExecutionSnapshot;
import com.workflow.api.dto.NodeRunResult;
import lombok.Getter;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Getter
public class ExecutionContext {
    private final Map<String, Map<String, Object>> nodeOutputs = new HashMap<>();
    private final String runId;
    private final String startTime;

    public ExecutionContext(String runId) {
        this.runId = runId;
        this.startTime = Instant.now().toString();
    }

    public void addNodeResult(NodeRunResult result) {
        nodeOutputs.put(result.getNodeId(), result.getOutputs());
    }

    public ExecutionSnapshot snapshot() {
        // Deep copy to prevent external modifications
        Map<String, Map<String, Object>> copiedOutputs = new HashMap<>();
        nodeOutputs.forEach((key, value) -> {
            Map<String, Object> copiedValue = new HashMap<>(value);
            copiedOutputs.put(key, copiedValue);
        });

        return new ExecutionSnapshot(
            copiedOutputs,
            runId,
            startTime
        );
    }
}
