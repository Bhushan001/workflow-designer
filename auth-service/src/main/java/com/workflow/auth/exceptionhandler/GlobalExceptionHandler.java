package com.workflow.auth.exceptionhandler;

import com.workflow.constants.ErrorConstants;
import com.workflow.exceptions.GeneralException;
import com.workflow.exceptions.client.ClientAlreadyExistsException;
import com.workflow.exceptions.client.ClientNotFoundException;
import com.workflow.exceptions.role.RoleAlreadyExistsException;
import com.workflow.exceptions.role.RoleNotFoundException;
import com.workflow.exceptions.user.InvalidCredentialsException;
import com.workflow.exceptions.user.UserAlreadyExistsException;
import com.workflow.exceptions.user.UserNotAuthenticatedException;
import com.workflow.exceptions.user.UserNotFoundException;
import com.workflow.model.CustomErrorResponse;
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
        EXCEPTION_MAP.put(ClientAlreadyExistsException.class, new ErrorDetails(ErrorConstants.CLIENT_ALREADY_EXISTS_ERROR_CODE, HttpStatus.BAD_REQUEST));
        EXCEPTION_MAP.put(UserAlreadyExistsException.class, new ErrorDetails(ErrorConstants.USER_ALREADY_EXISTS_ERROR_CODE, HttpStatus.BAD_REQUEST));
        EXCEPTION_MAP.put(RoleAlreadyExistsException.class, new ErrorDetails(ErrorConstants.ROLE_ALREADY_EXISTS_ERROR_CODE, HttpStatus.BAD_REQUEST));

        EXCEPTION_MAP.put(ClientNotFoundException.class, new ErrorDetails(ErrorConstants.CLIENT_NOT_FOUND_ERROR_CODE, HttpStatus.NOT_FOUND));
        EXCEPTION_MAP.put(UserNotFoundException.class, new ErrorDetails(ErrorConstants.USER_NOT_FOUND_ERROR_CODE, HttpStatus.NOT_FOUND));
        EXCEPTION_MAP.put(RoleNotFoundException.class, new ErrorDetails(ErrorConstants.ROLE_NOT_FOUND_ERROR_CODE, HttpStatus.NOT_FOUND));

        EXCEPTION_MAP.put(InvalidCredentialsException.class, new ErrorDetails(ErrorConstants.USER_CREDENTIALS_INVALID_ERROR_CODE, HttpStatus.BAD_REQUEST));
        EXCEPTION_MAP.put(UserNotAuthenticatedException.class, new ErrorDetails(ErrorConstants.USER_NOT_AUTHENTICATED_ERROR_CODE, HttpStatus.UNAUTHORIZED));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CustomErrorResponse> handleAllExceptions(Exception ex) {
        ErrorDetails errorDetails = EXCEPTION_MAP.get(ex.getClass());

        if (errorDetails != null) {
            CustomErrorResponse errorResponse = new CustomErrorResponse(errorDetails.errorCode, ex.getMessage());
            return ResponseEntity.status(errorDetails.httpStatus).body(errorResponse);
        } else {
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
