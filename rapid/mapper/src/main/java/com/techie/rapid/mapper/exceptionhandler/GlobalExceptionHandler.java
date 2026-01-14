package com.techie.rapid.mapper.exceptionhandler;

import com.techie.rapid.constants.ErrorConstants;
import com.techie.rapid.exceptions.GeneralException;
import com.techie.rapid.exceptions.mapping.MappingAlreadyExistsException;
import com.techie.rapid.exceptions.mapping.MappingNotFoundException;
import com.techie.rapid.exceptions.requestschema.RequestSchemaAlreadyExistsException;
import com.techie.rapid.exceptions.requestschema.RequestSchemaNotFoundException;
import com.techie.rapid.exceptions.s1schema.S1SchemaAlreadyExistsException;
import com.techie.rapid.exceptions.s1schema.S1SchemaNotFoundException;
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
        // Entity Already Exists Exceptions
        EXCEPTION_MAP.put(RequestSchemaAlreadyExistsException.class, new ErrorDetails(ErrorConstants.REQUESTSCHEMA_ALREADY_EXISTS_ERROR_CODE, HttpStatus.BAD_REQUEST));
        EXCEPTION_MAP.put(S1SchemaAlreadyExistsException.class, new ErrorDetails(ErrorConstants.S1SCHEMA_ALREADY_EXISTS_ERROR_CODE, HttpStatus.BAD_REQUEST));
        EXCEPTION_MAP.put(MappingAlreadyExistsException.class, new ErrorDetails(ErrorConstants.MAPPING_ALREADY_EXISTS_ERROR_CODE, HttpStatus.BAD_REQUEST));

        // Entity Already Exists Exceptions
        EXCEPTION_MAP.put(RequestSchemaNotFoundException.class, new ErrorDetails(ErrorConstants.REQUESTSCHEMA_NOT_FOUND_ERROR_CODE, HttpStatus.NOT_FOUND));
        EXCEPTION_MAP.put(S1SchemaNotFoundException.class, new ErrorDetails(ErrorConstants.S1SCHEMA_NOT_FOUND_ERROR_CODE, HttpStatus.NOT_FOUND));
        EXCEPTION_MAP.put(MappingNotFoundException.class, new ErrorDetails(ErrorConstants.MAPPING_NOT_FOUND_ERROR_CODE, HttpStatus.NOT_FOUND));
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

