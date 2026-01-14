package com.techie.rapid.exceptions.requestschema;

import com.techie.rapid.constants.ErrorConstants;

public class RequestSchemaAlreadyExistsException extends RuntimeException {

    public RequestSchemaAlreadyExistsException(String schemaName) {
        super(String.format(ErrorConstants.REQUESTSCHEMA_ALREADY_EXISTS_ERROR_MESSAGE, schemaName));
    }
}