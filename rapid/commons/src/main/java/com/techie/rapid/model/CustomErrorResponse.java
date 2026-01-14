package com.techie.rapid.model;

import lombok.Data;

@Data
public class CustomErrorResponse {
    private String errorCode;
    private String errorMessage;

    public CustomErrorResponse(String errorCode, String errorMessage) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }
}
