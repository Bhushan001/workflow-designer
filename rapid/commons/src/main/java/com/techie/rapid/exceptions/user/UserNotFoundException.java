package com.techie.rapid.exceptions.user;

import com.techie.rapid.constants.ErrorConstants;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String username) {
        super(String.format(ErrorConstants.USER_NOT_FOUND_ERROR_MESSAGE, username));
    }
}
