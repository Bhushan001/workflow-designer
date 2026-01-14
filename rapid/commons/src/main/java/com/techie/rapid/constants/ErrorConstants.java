package com.techie.rapid.constants;

public class ErrorConstants {
    // General error message
    public static final String GENERAL_ERROR_CODE = "RAPID-01";
    public static final String GENERAL_ERROR_MESSAGE = "An error occurred while processing your request.";

    // Client related error messages
    public static final String CLIENT_ALREADY_EXISTS_ERROR_CODE = "RAPID-02";
    public static final String CLIENT_ALREADY_EXISTS_ERROR_MESSAGE = "Client with id: %s already exists.";
    public static final String CLIENT_NOT_FOUND_ERROR_CODE = "RAPID-03";
    public static final String CLIENT_NOT_FOUND_ERROR_MESSAGE = "Client with id: %s not found.";

    // User related error messages
    public static final String USER_ALREADY_EXISTS_ERROR_CODE = "RAPID-04";
    public static final String USER_ALREADY_EXISTS_ERROR_MESSAGE = "User with username: %s already exists.";
    public static final String USER_NOT_FOUND_ERROR_CODE = "RAPID-05";
    public static final String USER_NOT_FOUND_ERROR_MESSAGE = "User with username: %s not found.";
    public static final String USER_CREDENTIALS_INVALID_ERROR_CODE = "RAPID-06";
    public static final String USER_CREDENTIALS_INVALID_ERROR_MESSAGE = "credentials for username: %s are incorrect.";
    public static final String USER_NOT_AUTHENTICATED_ERROR_CODE = "RAPID-07";
    public static final String USER_NOT_AUTHENTICATED_ERROR_MESSAGE = "User is not authenticated.";

    // Role related error messages
    public static final String ROLE_ALREADY_EXISTS_ERROR_CODE = "RAPID-08";
    public static final String ROLE_ALREADY_EXISTS_ERROR_MESSAGE = "Role with code: %s already exists.";
    public static final String ROLE_NOT_FOUND_ERROR_CODE = "RAPID-09";
    public static final String ROLE_NOT_FOUND_ERROR_MESSAGE = "Role with code: %s not found.";

    // Request Schema related error messages
    public static final String REQUESTSCHEMA_ALREADY_EXISTS_ERROR_CODE = "RAPID-10";
    public static final String REQUESTSCHEMA_ALREADY_EXISTS_ERROR_MESSAGE = "Request Schema with name: %s already exists.";
    public static final String REQUESTSCHEMA_NOT_FOUND_ERROR_CODE = "RAPID-11";
    public static final String REQUESTSCHEMA_NOT_FOUND_ERROR_MESSAGE = "Request Schema with name: %s not found.";

    // S1 Schema related error messages
    public static final String S1SCHEMA_ALREADY_EXISTS_ERROR_CODE = "RAPID-12";
    public static final String S1SCHEMA_ALREADY_EXISTS_ERROR_MESSAGE = "S1 Schema with name: %s already exists.";
    public static final String S1SCHEMA_NOT_FOUND_ERROR_CODE = "RAPID-13";
    public static final String S1SCHEMA_NOT_FOUND_ERROR_MESSAGE = "S1 Schema with name: %s not found.";

    // Mapping related error messages
    public static final String MAPPING_ALREADY_EXISTS_ERROR_CODE = "RAPID-14";
    public static final String MAPPING_ALREADY_EXISTS_ERROR_MESSAGE = "Mapping with name: %s already exists.";
    public static final String MAPPING_NOT_FOUND_ERROR_CODE = "RAPID-15";
    public static final String MAPPING_NOT_FOUND_ERROR_MESSAGE = "Mapping with name: %s not found.";

    // Workspace related error messages
    public static final String WORKSPACE_ALREADY_EXISTS_ERROR_CODE = "RAPID-16";
    public static final String WORKSPACE_ALREADY_EXISTS_ERROR_MESSAGE = "Workspace with name: %s already exists.";
    public static final String WORKSPACE_ID_NOT_FOUND_ERROR_CODE = "RAPID-17";
    public static final String WORKSPACE_ID_NOT_FOUND_ERROR_MESSAGE = "Workspace with id: %s not found.";
    public static final String WORKSPACE_NAME_NOT_FOUND_ERROR_CODE = "RAPID-18";
    public static final String WORKSPACE_NAME_NOT_FOUND_ERROR_MESSAGE = "Workspace with name: %s not found.";

    // Project related error messages
    public static final String PROJECT_ALREADY_EXISTS_ERROR_CODE = "RAPID-19";
    public static final String PROJECT_ALREADY_EXISTS_ERROR_MESSAGE = "Project with name: %s already exists.";
    public static final String PROJECT_ID_NOT_FOUND_ERROR_CODE = "RAPID-20";
    public static final String PROJECT_ID_NOT_FOUND_ERROR_MESSAGE = "Project with id: %s not found.";
    public static final String PROJECT_NAME_NOT_FOUND_ERROR_CODE = "RAPID-18";
    public static final String PROJECT_NAME_NOT_FOUND_ERROR_MESSAGE = "Project with name: %s not found.";

    // Page related error messages
    public static final String PAGE_ALREADY_EXISTS_ERROR_CODE = "RAPID-21";
    public static final String PAGE_ALREADY_EXISTS_ERROR_MESSAGE = "Page with name: %s already exists.";
    public static final String PAGE_ID_NOT_FOUND_ERROR_CODE = "RAPID-22";
    public static final String PAGE_ID_NOT_FOUND_ERROR_MESSAGE = "Page with id: %s not found.";
    public static final String PAGE_NAME_NOT_FOUND_ERROR_CODE = "RAPID-18";
    public static final String PAGE_NAME_NOT_FOUND_ERROR_MESSAGE = "Page with name: %s not found.";
}
