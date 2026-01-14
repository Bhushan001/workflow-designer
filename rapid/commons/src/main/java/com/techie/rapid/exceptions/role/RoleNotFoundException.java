package com.techie.rapid.exceptions.role;

import com.techie.rapid.constants.ErrorConstants;

public class RoleNotFoundException extends RuntimeException {

    public RoleNotFoundException(String roleCode) {
        super(String.format(ErrorConstants.ROLE_NOT_FOUND_ERROR_MESSAGE, roleCode));
    }
}

