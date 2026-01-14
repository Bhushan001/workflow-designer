package com.techie.rapid.exceptions.mapping;

import com.techie.rapid.constants.ErrorConstants;

public class MappingAlreadyExistsException extends RuntimeException {

    public MappingAlreadyExistsException(String mappingName) {
        super(String.format(ErrorConstants.MAPPING_ALREADY_EXISTS_ERROR_MESSAGE, mappingName));
    }
}