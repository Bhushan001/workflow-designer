package com.techie.rapid.exceptions.s1schema;

import com.techie.rapid.constants.ErrorConstants;

public class S1SchemaAlreadyExistsException extends RuntimeException {

    public S1SchemaAlreadyExistsException(String schemaName) {
        super(String.format(ErrorConstants.S1SCHEMA_ALREADY_EXISTS_ERROR_MESSAGE, schemaName));
    }
}