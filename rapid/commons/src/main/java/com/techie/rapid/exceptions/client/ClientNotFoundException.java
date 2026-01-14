package com.techie.rapid.exceptions.client;

import com.techie.rapid.constants.ErrorConstants;

import java.util.UUID;

public class ClientNotFoundException extends RuntimeException {

    public ClientNotFoundException(UUID clientId) {
        super(String.format(ErrorConstants.CLIENT_NOT_FOUND_ERROR_MESSAGE, clientId));
    }
}
