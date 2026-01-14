package com.techie.rapid.exceptions.page;

import com.techie.rapid.constants.ErrorConstants;

public class PageAlreadyExistsException extends RuntimeException {

    public PageAlreadyExistsException(String pageName) {
        super(String.format(ErrorConstants.PAGE_ALREADY_EXISTS_ERROR_MESSAGE, pageName));
    }
}
