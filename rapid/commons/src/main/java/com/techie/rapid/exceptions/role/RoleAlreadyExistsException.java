package com.techie.rapid.exceptions.role;

import com.techie.rapid.constants.ErrorConstants;

public class RoleAlreadyExistsException extends RuntimeException {

    public RoleAlreadyExistsException(String roleCode) {
        super(String.format(ErrorConstants.CLIENT_ALREADY_EXISTS_ERROR_MESSAGE, roleCode));
    }
}