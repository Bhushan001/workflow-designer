package com.techie.rapid.exceptions.workspace;

import com.techie.rapid.constants.ErrorConstants;

import java.util.UUID;

public class WorkspaceNotFoundException extends RuntimeException {

    public WorkspaceNotFoundException(UUID workspaceId) {
        super(String.format(ErrorConstants.WORKSPACE_ID_NOT_FOUND_ERROR_MESSAGE, workspaceId));
    }

    public WorkspaceNotFoundException(String workspaceName) {
        super(String.format(ErrorConstants.WORKSPACE_NAME_NOT_FOUND_ERROR_MESSAGE, workspaceName));
    }
}