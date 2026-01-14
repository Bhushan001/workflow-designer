package com.workflow.exceptions.user;

import com.workflow.constants.ErrorConstants;

public class UserNotAuthenticatedException extends RuntimeException {

    public UserNotAuthenticatedException() {
        super(ErrorConstants.USER_NOT_AUTHENTICATED_ERROR_MESSAGE);
    }
}
