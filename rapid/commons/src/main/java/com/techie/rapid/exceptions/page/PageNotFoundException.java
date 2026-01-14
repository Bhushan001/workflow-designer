package com.techie.rapid.exceptions.page;

import com.techie.rapid.constants.ErrorConstants;

import java.util.UUID;

public class PageNotFoundException extends RuntimeException {

    public PageNotFoundException(UUID id) {
        super(String.format(ErrorConstants.PAGE_ID_NOT_FOUND_ERROR_MESSAGE, id));
    }

    public PageNotFoundException(String pageName) {
        super(String.format(ErrorConstants.PAGE_NAME_NOT_FOUND_ERROR_MESSAGE, pageName));
    }
}