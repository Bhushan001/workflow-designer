package com.workflow.api.service.runners;

import com.workflow.api.dto.ExecutionSnapshot;
import com.workflow.api.dto.NodeRunResult;
import com.workflow.api.dto.WorkflowNode;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Component
public class TriggerNodeRunner implements NodeRunner {
    
    @Override
    public NodeRunResult run(WorkflowNode node, ExecutionSnapshot snapshot) {
        Map<String, Object> config = node.getData().getConfig();
        String triggerType = (String) config.getOrDefault("triggerType", "MANUAL");
        
        Map<String, Object> outputs = new HashMap<>();
        outputs.put("triggerType", triggerType);
        outputs.put("triggeredAt", Instant.now().toString());
        outputs.put("snapshot", snapshot);
        
        return new NodeRunResult(
            node.getId(),
            outputs,
            "success",
            null,
            Instant.now().toString()
        );
    }
}
