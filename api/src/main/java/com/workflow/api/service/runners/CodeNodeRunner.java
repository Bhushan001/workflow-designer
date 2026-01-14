package com.workflow.api.service.runners;

import com.workflow.api.dto.ExecutionSnapshot;
import com.workflow.api.dto.NodeRunResult;
import com.workflow.api.dto.WorkflowNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import javax.script.ScriptException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class CodeNodeRunner implements NodeRunner {
    
    @Override
    public NodeRunResult run(WorkflowNode node, ExecutionSnapshot snapshot) {
        Map<String, Object> config = node.getData().getConfig();
        String code = (String) config.get("code");
        
        if (code == null || code.trim().isEmpty()) {
            return new NodeRunResult(
                node.getId(),
                new HashMap<>(),
                "failed",
                "Code is required",
                Instant.now().toString()
            );
        }
        
        try {
            // Use Rhino directly via Context API
            Context rhinoContext = Context.enter();
            try {
                Scriptable scope = rhinoContext.initStandardObjects();
                
                // Create JavaScript-friendly snapshot
                Map<String, Object> jsSnapshot = new HashMap<>();
                jsSnapshot.put("nodeOutputs", snapshot.getNodeOutputs());
                jsSnapshot.put("runId", snapshot.getRunId());
                jsSnapshot.put("startTime", snapshot.getStartTime());
                
                // Put snapshot data into scope
                ScriptableObject.putProperty(scope, "snapshot", Context.javaToJS(jsSnapshot, scope));
                
                // Also provide $json for n8n-style expressions
                Map<String, Object> jsonData = getLatestNodeOutput(snapshot);
                ScriptableObject.putProperty(scope, "$json", Context.javaToJS(jsonData, scope));
                ScriptableObject.putProperty(scope, "json", Context.javaToJS(jsonData, scope));
                
                // Execute the code
                Object result = rhinoContext.evaluateString(scope, code, "code", 1, null);
            
                Map<String, Object> outputs = new HashMap<>();
                outputs.put("result", result);
                outputs.put("inputSnapshot", snapshot);
                outputs.put("executedAt", Instant.now().toString());
                
                return new NodeRunResult(
                    node.getId(),
                    outputs,
                    "success",
                    null,
                    Instant.now().toString()
                );
            } finally {
                Context.exit();
            }
            
        } catch (org.mozilla.javascript.RhinoException e) {
            log.error("Error executing code in node: {}", node.getId(), e);
            return new NodeRunResult(
                node.getId(),
                new HashMap<>(),
                "failed",
                "Code execution error: " + e.getMessage(),
                Instant.now().toString()
            );
        } catch (Exception e) {
            log.error("Unexpected error in code node: {}", node.getId(), e);
            return new NodeRunResult(
                node.getId(),
                new HashMap<>(),
                "failed",
                "Error: " + e.getMessage(),
                Instant.now().toString()
            );
        }
    }
    
    /**
     * Gets the latest node output for $json variable.
     */
    private Map<String, Object> getLatestNodeOutput(ExecutionSnapshot snapshot) {
        Map<String, Map<String, Object>> nodeOutputs = snapshot.getNodeOutputs();
        if (nodeOutputs == null || nodeOutputs.isEmpty()) {
            return new HashMap<>();
        }
        
        Map<String, Object> merged = new HashMap<>();
        for (Map<String, Object> outputs : nodeOutputs.values()) {
            if (outputs != null) {
                merged.putAll(outputs);
            }
        }
        
        if (merged.containsKey("response")) {
            Object response = merged.get("response");
            if (response instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> responseMap = (Map<String, Object>) response;
                if (responseMap.containsKey("data")) {
                    return responseMap;
                }
            }
        }
        
        return merged;
    }
}
