package com.techie.rapid.exceptions.user;

import com.techie.rapid.constants.ErrorConstants;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super(ErrorConstants.USER_CREDENTIALS_INVALID_ERROR_MESSAGE);
    }
}
