package com.techie.rapid.exceptions.workspace;

import com.techie.rapid.constants.ErrorConstants;

public class WorkspaceAlreadyExistsException extends RuntimeException {

    public WorkspaceAlreadyExistsException(String workspaceName) {
        super(String.format(ErrorConstants.WORKSPACE_ALREADY_EXISTS_ERROR_MESSAGE, workspaceName));
    }
}