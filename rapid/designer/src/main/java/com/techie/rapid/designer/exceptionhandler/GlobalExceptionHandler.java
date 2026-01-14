package com.techie.rapid.designer.exceptionhandler;

import com.techie.rapid.constants.ErrorConstants;
import com.techie.rapid.exceptions.GeneralException;
import com.techie.rapid.exceptions.page.PageAlreadyExistsException;
import com.techie.rapid.exceptions.page.PageNotFoundException;
import com.techie.rapid.exceptions.project.ProjectAlreadyExistsException;
import com.techie.rapid.exceptions.project.ProjectNotFoundException;
import com.techie.rapid.exceptions.workspace.WorkspaceAlreadyExistsException;
import com.techie.rapid.exceptions.workspace.WorkspaceNotFoundException;
import com.techie.rapid.model.CustomErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Map<Class<? extends Exception>, ErrorDetails> EXCEPTION_MAP = new HashMap<>();

    static {
        EXCEPTION_MAP.put(GeneralException.class, new ErrorDetails(ErrorConstants.GENERAL_ERROR_CODE, HttpStatus.BAD_REQUEST));
        // Entity Not Found Exceptions
        EXCEPTION_MAP.put(WorkspaceNotFoundException.class, new ErrorDetails(ErrorConstants.WORKSPACE_ID_NOT_FOUND_ERROR_CODE, HttpStatus.NOT_FOUND));
        EXCEPTION_MAP.put(ProjectNotFoundException.class, new ErrorDetails(ErrorConstants.PROJECT_ID_NOT_FOUND_ERROR_CODE, HttpStatus.NOT_FOUND));
        EXCEPTION_MAP.put(PageNotFoundException.class, new ErrorDetails(ErrorConstants.PAGE_ID_NOT_FOUND_ERROR_CODE, HttpStatus.NOT_FOUND));

        // Entity Already Exists Exceptions
        EXCEPTION_MAP.put(WorkspaceAlreadyExistsException.class, new ErrorDetails(ErrorConstants.WORKSPACE_ALREADY_EXISTS_ERROR_CODE, HttpStatus.BAD_REQUEST));
        EXCEPTION_MAP.put(ProjectAlreadyExistsException.class, new ErrorDetails(ErrorConstants.PROJECT_ALREADY_EXISTS_ERROR_CODE, HttpStatus.BAD_REQUEST));
        EXCEPTION_MAP.put(PageAlreadyExistsException.class, new ErrorDetails(ErrorConstants.PAGE_ALREADY_EXISTS_ERROR_CODE, HttpStatus.BAD_REQUEST));

    }

    @ExceptionHandler(Exception.class) // Or a common base exception from your commons library
    public ResponseEntity<CustomErrorResponse> handleAllExceptions(Exception ex) {
        ErrorDetails errorDetails = EXCEPTION_MAP.get(ex.getClass());

        if (errorDetails != null) {
            CustomErrorResponse errorResponse = new CustomErrorResponse(errorDetails.errorCode, ex.getMessage());
            return ResponseEntity.status(errorDetails.httpStatus).body(errorResponse);
        } else {
            // Default handling for unmapped exceptions
            CustomErrorResponse errorResponse = new CustomErrorResponse(ErrorConstants.GENERAL_ERROR_CODE, "An unexpected error occurred.");
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

