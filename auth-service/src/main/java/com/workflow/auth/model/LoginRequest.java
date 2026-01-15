package com.workflow.auth.model;

import lombok.Data;

@Data
public class LoginRequest {
    private String username; // Can be username or email
    private String email;    // Can be username or email
    private String password;
    
    /**
     * Get the login identifier (username or email)
     * If both are provided, username takes precedence
     */
    public String getLoginIdentifier() {
        if (username != null && !username.trim().isEmpty()) {
            return username.trim();
        }
        if (email != null && !email.trim().isEmpty()) {
            return email.trim();
        }
        return null;
    }
}
