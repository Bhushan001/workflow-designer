package com.workflow.exceptions.user;

import com.workflow.constants.ErrorConstants;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String username) {
        super(String.format(ErrorConstants.USER_NOT_FOUND_ERROR_MESSAGE, username));
    }
}
