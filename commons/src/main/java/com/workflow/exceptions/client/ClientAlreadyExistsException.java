package com.workflow.exceptions.client;

import com.workflow.constants.ErrorConstants;

public class ClientAlreadyExistsException extends RuntimeException {

    public ClientAlreadyExistsException(String name) {
        super(String.format(ErrorConstants.CLIENT_ALREADY_EXISTS_ERROR_MESSAGE, name));
    }
}
