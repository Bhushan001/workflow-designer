package com.workflow.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlatformSettingsDto {
    private UUID id;

    // General Settings
    private String platformName;
    private String platformEmail;
    private String defaultTimezone;
    private String defaultLocale;
    private String platformDescription;

    // Security Settings
    private Integer passwordMinLength;
    private Boolean passwordRequireUppercase;
    private Boolean passwordRequireLowercase;
    private Boolean passwordRequireNumbers;
    private Boolean passwordRequireSpecialChars;
    private Integer sessionTimeoutMinutes;
    private Integer jwtTokenExpirationHours;
    private Integer maxLoginAttempts;
    private Integer lockoutDurationMinutes;
    private Boolean enableEmailLogin;

    // Default Quotas
    private Integer defaultMaxUsersPerClient;
    private Integer defaultMaxWorkflowsPerClient;
    private Integer defaultStorageQuotaMb;

    // Email/SMTP Configuration
    private String smtpHost;
    private Integer smtpPort;
    private String smtpUsername;
    @JsonIgnore // Never serialize password in responses (GET), but allow deserialization in requests (PUT)
    private String smtpPassword; // Only used for updates, never returned in GET responses
    private String smtpFromEmail;
    private String smtpFromName;
    private Boolean smtpEnableTls;

    // System Configuration
    private Boolean maintenanceMode;
    private String maintenanceMessage;
    private String systemStatus;

    // Metadata
    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;
    private UUID createdBy;
    private UUID updatedBy;
}
