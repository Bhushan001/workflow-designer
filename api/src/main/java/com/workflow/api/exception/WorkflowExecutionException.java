package com.workflow.api.exception;

import lombok.Getter;

@Getter
public class WorkflowExecutionException extends RuntimeException {
    
    public WorkflowExecutionException(String message) {
        super(message);
    }
    
    public WorkflowExecutionException(String message, Throwable cause) {
        super(message, cause);
    }
}
