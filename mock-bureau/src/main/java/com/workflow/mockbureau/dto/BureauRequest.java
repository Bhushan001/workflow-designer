package com.workflow.mockbureau.dto;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import lombok.Data;
import java.util.HashMap;
import java.util.Map;

@Data
public class BureauRequest {
    private Map<String, Object> data = new HashMap<>();
    
    @JsonAnySetter
    public void setDynamicProperty(String key, Object value) {
        this.data.put(key, value);
    }
}

