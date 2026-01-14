package com.workflow.exceptions.user;

import com.workflow.constants.ErrorConstants;

public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException(String username) {
        super(String.format(ErrorConstants.USER_CREDENTIALS_INVALID_ERROR_MESSAGE, username));
    }

    public InvalidCredentialsException() {
        super(ErrorConstants.USER_CREDENTIALS_INVALID_ERROR_MESSAGE.replace("%s", ""));
    }
}
