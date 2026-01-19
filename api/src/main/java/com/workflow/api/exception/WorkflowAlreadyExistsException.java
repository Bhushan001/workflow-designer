package com.workflow.api.exception;

public class WorkflowAlreadyExistsException extends RuntimeException {
    
    public WorkflowAlreadyExistsException(String message) {
        super(message);
    }
    
    public WorkflowAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
