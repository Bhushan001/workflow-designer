package com.workflow.exceptions.role;

import com.workflow.constants.ErrorConstants;

public class RoleAlreadyExistsException extends RuntimeException {

    public RoleAlreadyExistsException(String roleCode) {
        super(String.format(ErrorConstants.ROLE_ALREADY_EXISTS_ERROR_MESSAGE, roleCode));
    }
}
