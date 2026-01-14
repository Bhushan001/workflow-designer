package com.techie.rapid.exceptions;

import com.techie.rapid.constants.ErrorConstants;

public class GeneralException extends RuntimeException {

    public GeneralException() {
        super(ErrorConstants.GENERAL_ERROR_MESSAGE);
    }
}
