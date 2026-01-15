package com.workflow.auth.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SmtpTestRequest {
    @NotBlank(message = "SMTP host is required")
    private String smtpHost;
    
    @NotNull(message = "SMTP port is required")
    private Integer smtpPort;
    
    @NotBlank(message = "SMTP username is required")
    private String smtpUsername;
    
    @NotBlank(message = "SMTP password is required")
    private String smtpPassword;
    
    @NotNull(message = "TLS setting is required")
    private Boolean smtpEnableTls;
    
    @NotBlank(message = "Test email address is required")
    @Email(message = "Test email must be a valid email address")
    private String testEmail;
}
