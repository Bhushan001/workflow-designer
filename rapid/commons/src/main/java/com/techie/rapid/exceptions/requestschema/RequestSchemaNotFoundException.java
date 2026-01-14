package com.techie.rapid.exceptions.requestschema;

import com.techie.rapid.constants.ErrorConstants;

public class RequestSchemaNotFoundException extends RuntimeException {

    public RequestSchemaNotFoundException(String schemaName) {
        super(String.format(ErrorConstants.REQUESTSCHEMA_NOT_FOUND_ERROR_MESSAGE, schemaName));
    }
}

