package com.techie.rapid.exceptions.project;

import com.techie.rapid.constants.ErrorConstants;

import java.util.UUID;

public class ProjectNotFoundException extends RuntimeException {

    public ProjectNotFoundException(UUID id) {
        super(String.format(ErrorConstants.PROJECT_ID_NOT_FOUND_ERROR_MESSAGE, id));
    }

    public ProjectNotFoundException(String projectName) {
        super(String.format(ErrorConstants.PROJECT_NAME_NOT_FOUND_ERROR_MESSAGE, projectName));
    }
}