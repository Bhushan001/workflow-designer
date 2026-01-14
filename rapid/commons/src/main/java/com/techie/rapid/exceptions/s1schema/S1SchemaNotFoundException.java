package com.techie.rapid.exceptions.s1schema;

import com.techie.rapid.constants.ErrorConstants;

public class S1SchemaNotFoundException extends RuntimeException {

    public S1SchemaNotFoundException(String schemaName) {
        super(String.format(ErrorConstants.S1SCHEMA_NOT_FOUND_ERROR_MESSAGE, schemaName));
    }
}