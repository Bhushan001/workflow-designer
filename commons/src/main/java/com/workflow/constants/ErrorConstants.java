package com.workflow.constants;

public class ErrorConstants {
    // General error message
    public static final String GENERAL_ERROR_CODE = "WORKFLOW-01";
    public static final String GENERAL_ERROR_MESSAGE = "An error occurred while processing your request.";

    // Client related error messages
    public static final String CLIENT_ALREADY_EXISTS_ERROR_CODE = "WORKFLOW-02";
    public static final String CLIENT_ALREADY_EXISTS_ERROR_MESSAGE = "Client with id: %s already exists.";
    public static final String CLIENT_NOT_FOUND_ERROR_CODE = "WORKFLOW-03";
    public static final String CLIENT_NOT_FOUND_ERROR_MESSAGE = "Client with id: %s not found.";

    // User related error messages
    public static final String USER_ALREADY_EXISTS_ERROR_CODE = "WORKFLOW-04";
    public static final String USER_ALREADY_EXISTS_ERROR_MESSAGE = "User with username: %s already exists.";
    public static final String USER_NOT_FOUND_ERROR_CODE = "WORKFLOW-05";
    public static final String USER_NOT_FOUND_ERROR_MESSAGE = "User with username: %s not found.";
    public static final String USER_CREDENTIALS_INVALID_ERROR_CODE = "WORKFLOW-06";
    public static final String USER_CREDENTIALS_INVALID_ERROR_MESSAGE = "credentials for username: %s are incorrect.";
    public static final String USER_NOT_AUTHENTICATED_ERROR_CODE = "WORKFLOW-07";
    public static final String USER_NOT_AUTHENTICATED_ERROR_MESSAGE = "User is not authenticated.";

    // Role related error messages
    public static final String ROLE_ALREADY_EXISTS_ERROR_CODE = "WORKFLOW-08";
    public static final String ROLE_ALREADY_EXISTS_ERROR_MESSAGE = "Role with code: %s already exists.";
    public static final String ROLE_NOT_FOUND_ERROR_CODE = "WORKFLOW-09";
    public static final String ROLE_NOT_FOUND_ERROR_MESSAGE = "Role with code: %s not found.";
}
