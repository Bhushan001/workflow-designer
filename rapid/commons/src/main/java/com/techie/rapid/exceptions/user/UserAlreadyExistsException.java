package com.techie.rapid.exceptions.user;

import com.techie.rapid.constants.ErrorConstants;

public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String username) {
        super(String.format(ErrorConstants.USER_ALREADY_EXISTS_ERROR_MESSAGE, username));
    }
}
