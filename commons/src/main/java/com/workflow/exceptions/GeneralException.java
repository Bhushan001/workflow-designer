package com.workflow.exceptions;

import com.workflow.constants.ErrorConstants;

public class GeneralException extends RuntimeException {

    public GeneralException() {
        super(ErrorConstants.GENERAL_ERROR_MESSAGE);
    }
}
