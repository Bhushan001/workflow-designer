package com.techie.rapid.exceptions.project;

import com.techie.rapid.constants.ErrorConstants;


public class ProjectAlreadyExistsException extends RuntimeException {

    public ProjectAlreadyExistsException(String projectName) {
        super(String.format(ErrorConstants.PAGE_ALREADY_EXISTS_ERROR_MESSAGE, projectName));
    }
}