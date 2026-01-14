package com.techie.rapid.exceptions.user;

import com.techie.rapid.constants.ErrorConstants;

public class UserNotAuthenticatedException extends RuntimeException {
    public UserNotAuthenticatedException() {
        super(ErrorConstants.USER_NOT_AUTHENTICATED_ERROR_MESSAGE);
    }
}

