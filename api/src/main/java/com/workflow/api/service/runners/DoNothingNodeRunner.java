package com.workflow.api.service.runners;

import com.workflow.api.dto.ExecutionSnapshot;
import com.workflow.api.dto.NodeRunResult;
import com.workflow.api.dto.WorkflowNode;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Component
public class DoNothingNodeRunner implements NodeRunner {
    
    @Override
    public NodeRunResult run(WorkflowNode node, ExecutionSnapshot snapshot) {
        Map<String, Object> outputs = new HashMap<>();
        outputs.put("note", "No operation performed");
        outputs.put("snapshot", snapshot);
        outputs.put("executedAt", Instant.now().toString());
        
        return new NodeRunResult(
            node.getId(),
            outputs,
            "success",
            null,
            Instant.now().toString()
        );
    }
}
