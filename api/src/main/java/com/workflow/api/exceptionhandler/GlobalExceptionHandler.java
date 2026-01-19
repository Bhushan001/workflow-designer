package com.workflow.api.exceptionhandler;

import com.workflow.api.exception.*;
import com.workflow.constants.ErrorConstants;
import com.workflow.exceptions.GeneralException;
import com.workflow.model.CustomErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Map<Class<? extends Exception>, ErrorDetails> EXCEPTION_MAP = new HashMap<>();

    static {
        // General exceptions
        EXCEPTION_MAP.put(GeneralException.class, new ErrorDetails(ErrorConstants.GENERAL_ERROR_CODE, HttpStatus.BAD_REQUEST));
        
        // Workflow exceptions
        EXCEPTION_MAP.put(WorkflowNotFoundException.class, new ErrorDetails("WORKFLOW_NOT_FOUND", HttpStatus.NOT_FOUND));
        EXCEPTION_MAP.put(WorkflowAlreadyExistsException.class, new ErrorDetails("WORKFLOW_ALREADY_EXISTS", HttpStatus.BAD_REQUEST));
        EXCEPTION_MAP.put(WorkflowValidationException.class, new ErrorDetails("WORKFLOW_VALIDATION_ERROR", HttpStatus.BAD_REQUEST));
        EXCEPTION_MAP.put(WorkflowAccessDeniedException.class, new ErrorDetails("WORKFLOW_ACCESS_DENIED", HttpStatus.FORBIDDEN));
        EXCEPTION_MAP.put(WorkflowExecutionException.class, new ErrorDetails("WORKFLOW_EXECUTION_ERROR", HttpStatus.BAD_REQUEST));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<CustomErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.error("Invalid request: {}", ex.getMessage());
        CustomErrorResponse errorResponse = new CustomErrorResponse("INVALID_REQUEST", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(WorkflowAccessDeniedException.class)
    public ResponseEntity<CustomErrorResponse> handleWorkflowAccessDeniedException(WorkflowAccessDeniedException ex) {
        log.error("Workflow access denied: {}", ex.getMessage());
        CustomErrorResponse errorResponse = new CustomErrorResponse("WORKFLOW_ACCESS_DENIED", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CustomErrorResponse> handleAllExceptions(Exception ex) {
        ErrorDetails errorDetails = EXCEPTION_MAP.get(ex.getClass());

        if (errorDetails != null) {
            log.error("Handled exception: {} - {}", ex.getClass().getSimpleName(), ex.getMessage());
            CustomErrorResponse errorResponse = new CustomErrorResponse(errorDetails.errorCode, ex.getMessage());
            return ResponseEntity.status(errorDetails.httpStatus).body(errorResponse);
        } else {
            log.error("Unhandled exception: ", ex);
            CustomErrorResponse errorResponse = new CustomErrorResponse(
                ErrorConstants.GENERAL_ERROR_CODE, 
                "An unexpected error occurred: " + ex.getMessage()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    private static class ErrorDetails {
        String errorCode;
        HttpStatus httpStatus;
        
        ErrorDetails(String errorCode, HttpStatus httpStatus) {
            this.errorCode = errorCode;
            this.httpStatus = httpStatus;
        }
    }
}
