package com.workflow.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowNode {
    private String id;
    private String type; // TRIGGER, HTTP_REQUEST, CONDITION, DO_NOTHING, CODE
    private Position position;
    private NodeData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Position {
        private double x;
        private double y;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NodeData {
        private String label;
        @JsonProperty("config")
        private Map<String, Object> config;
    }
}
