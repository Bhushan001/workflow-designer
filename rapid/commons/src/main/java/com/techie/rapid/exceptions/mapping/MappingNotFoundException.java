package com.techie.rapid.exceptions.mapping;

import com.techie.rapid.constants.ErrorConstants;

public class MappingNotFoundException extends RuntimeException {

    public MappingNotFoundException(String mappingName) {
        super(String.format(ErrorConstants.MAPPING_NOT_FOUND_ERROR_MESSAGE, mappingName));
    }
}
