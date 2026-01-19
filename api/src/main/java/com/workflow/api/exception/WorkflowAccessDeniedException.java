package com.workflow.api.exception;

public class WorkflowAccessDeniedException extends RuntimeException {
    
    public WorkflowAccessDeniedException(String message) {
        super(message);
    }
    
    public WorkflowAccessDeniedException(String message, Throwable cause) {
        super(message, cause);
    }
}
