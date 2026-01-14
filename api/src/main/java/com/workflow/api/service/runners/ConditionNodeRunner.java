package com.workflow.api.service.runners;

import com.workflow.api.dto.ExecutionSnapshot;
import com.workflow.api.dto.NodeRunResult;
import com.workflow.api.dto.WorkflowNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineFactory;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class ConditionNodeRunner implements NodeRunner {
    
    private final ScriptEngineManager scriptEngineManager = new ScriptEngineManager();
    
    @Override
    public NodeRunResult run(WorkflowNode node, ExecutionSnapshot snapshot) {
        Map<String, Object> config = node.getData().getConfig();
        String expression = (String) config.get("expression");
        
        if (expression == null || expression.trim().isEmpty()) {
            return new NodeRunResult(
                node.getId(),
                new HashMap<>(),
                "failed",
                "Condition expression is required",
                Instant.now().toString()
            );
        }
        
        try {
            // Prepare expression - remove {{ }} if present and extract the inner expression
            String cleanExpression = cleanExpression(expression);
            
            // Use Rhino directly via Context API
            Context rhinoContext = Context.enter();
            try {
                Scriptable scope = rhinoContext.initStandardObjects();
                
                // Create JavaScript-friendly snapshot
                Map<String, Object> jsSnapshot = createJsSnapshot(snapshot);
                
                // Put snapshot data into scope
                ScriptableObject.putProperty(scope, "snapshot", Context.javaToJS(jsSnapshot, scope));
                
                // Also provide json variable (we replace $json with json in the expression)
                Map<String, Object> jsonData = getLatestNodeOutput(snapshot);
                
                // Log the json data structure for debugging
                log.debug("JSON data structure: {}", jsonData);
                log.debug("JSON data keys: {}", jsonData.keySet());
                if (jsonData.containsKey("response")) {
                    log.debug("Response object: {}", jsonData.get("response"));
                }
                
                // Convert Java Map to JavaScript object recursively
                // Context.javaToJS doesn't always handle nested Maps correctly, so we'll do it manually
                Object jsJsonData = convertToJavaScriptObject(jsonData, rhinoContext, scope);
                
                // Set json variable (the expression will use 'json' instead of '$json')
                ScriptableObject.putProperty(scope, "json", jsJsonData);
                
                // Log the cleaned expression for debugging
                log.debug("Original expression: {}", expression);
                log.debug("Cleaned expression: {}", cleanExpression);
                
                // Evaluate the expression
                Object result = rhinoContext.evaluateString(scope, cleanExpression, "condition", 1, null);
                
                // Convert result to boolean
                boolean conditionMet = Context.toBoolean(result);
            
                Map<String, Object> outputs = new HashMap<>();
                outputs.put("expression", expression);
                outputs.put("result", conditionMet);
                outputs.put("branch", conditionMet ? "true" : "false");
                outputs.put("evaluatedAt", Instant.now().toString());
                
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
            log.error("Error evaluating condition expression: {}", expression, e);
            
            // Provide more helpful error messages
            String errorMessage = e.getMessage();
            if (errorMessage != null && errorMessage.contains("Cannot read property")) {
                errorMessage = errorMessage + ". Make sure previous nodes have been executed and contain the expected data structure.";
            }
            
            return new NodeRunResult(
                node.getId(),
                new HashMap<>(),
                "failed",
                "Invalid expression: " + errorMessage,
                Instant.now().toString()
            );
        } catch (Exception e) {
            log.error("Unexpected error in condition node: {}", node.getId(), e);
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
     * Creates a JavaScript-friendly representation of the snapshot.
     * The snapshot object will have:
     * - snapshot.nodeOutputs[nodeId][outputKey] = value
     * - snapshot.runId = string
     * - snapshot.startTime = string
     */
    private Map<String, Object> createJsSnapshot(ExecutionSnapshot snapshot) {
        Map<String, Object> jsSnapshot = new HashMap<>();
        jsSnapshot.put("nodeOutputs", snapshot.getNodeOutputs());
        jsSnapshot.put("runId", snapshot.getRunId());
        jsSnapshot.put("startTime", snapshot.getStartTime());
        return jsSnapshot;
    }
    
    /**
     * Converts a Java Map/List to a JavaScript object/array recursively.
     * This ensures nested structures are properly accessible in JavaScript.
     */
    private Object convertToJavaScriptObject(Object obj, Context context, Scriptable scope) {
        if (obj == null) {
            return null;
        }
        
        if (obj instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> map = (Map<String, Object>) obj;
            Scriptable jsObject = context.newObject(scope);
            
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                Object jsValue = convertToJavaScriptObject(entry.getValue(), context, scope);
                ScriptableObject.putProperty(jsObject, entry.getKey(), jsValue);
            }
            
            return jsObject;
        } else if (obj instanceof List) {
            @SuppressWarnings("unchecked")
            List<Object> list = (List<Object>) obj;
            Object[] array = new Object[list.size()];
            
            for (int i = 0; i < list.size(); i++) {
                array[i] = convertToJavaScriptObject(list.get(i), context, scope);
            }
            
            return context.newArray(scope, array);
        } else {
            // For primitives and other types, use standard conversion
            return Context.javaToJS(obj, scope);
        }
    }
    
    /**
     * Gets the latest node output for $json variable.
     * Returns the most recent node's outputs, or empty map if none available.
     * For HTTP nodes, extracts response.data if available.
     */
    private Map<String, Object> getLatestNodeOutput(ExecutionSnapshot snapshot) {
        Map<String, Map<String, Object>> nodeOutputs = snapshot.getNodeOutputs();
        if (nodeOutputs == null || nodeOutputs.isEmpty()) {
            return new HashMap<>();
        }
        
        // Get the most recent node output (last in the map)
        // In practice, we'll merge all outputs with later ones taking precedence
        Map<String, Object> merged = new HashMap<>();
        for (Map<String, Object> outputs : nodeOutputs.values()) {
            if (outputs != null) {
                merged.putAll(outputs);
            }
        }
        
        // Return the full merged output structure
        // This allows expressions like: $json.response.data[0].id
        // The structure will be: { response: { data: [...] }, request: {...}, ... }
        return merged;
    }
    
    /**
     * Cleans the expression by removing n8n-style {{ }} wrappers if present.
     * Also replaces $json with json since $ at the start of identifiers can cause parsing issues in some JS engines.
     */
    private String cleanExpression(String expression) {
        if (expression == null) return "";
        String trimmed = expression.trim();
        
        // Remove all occurrences of {{ and }} (not just at start/end)
        // This handles cases like: {{ $json.response.status }} == 200
        trimmed = trimmed.replace("{{", "").replace("}}", "").trim();
        
        // Replace $json with json (Rhino has issues with $ at start of identifier)
        trimmed = trimmed.replace("$json", "json");
        
        return trimmed;
    }
}
