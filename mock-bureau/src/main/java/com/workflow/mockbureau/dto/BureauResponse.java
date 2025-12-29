package com.workflow.mockbureau.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BureauResponse {
    private boolean success;
    private String bureau;
    private String message;
    private Map<String, Object> data;
    private LocalDateTime timestamp;
    private String requestId;
}

