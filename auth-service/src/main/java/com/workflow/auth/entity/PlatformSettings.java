package com.workflow.auth.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Entity
@Table(name = "platform_settings")
@Data
@EqualsAndHashCode(callSuper = true)
public class PlatformSettings extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // General Settings
    @Column(name = "platform_name", nullable = false)
    private String platformName;

    @Column(name = "platform_email")
    private String platformEmail;

    @Column(name = "default_timezone")
    private String defaultTimezone;

    @Column(name = "default_locale")
    private String defaultLocale;

    @Column(name = "platform_description", columnDefinition = "TEXT")
    private String platformDescription;

    // Security Settings
    @Column(name = "password_min_length")
    private Integer passwordMinLength;

    @Column(name = "password_require_uppercase")
    private Boolean passwordRequireUppercase;

    @Column(name = "password_require_lowercase")
    private Boolean passwordRequireLowercase;

    @Column(name = "password_require_numbers")
    private Boolean passwordRequireNumbers;

    @Column(name = "password_require_special_chars")
    private Boolean passwordRequireSpecialChars;

    @Column(name = "session_timeout_minutes")
    private Integer sessionTimeoutMinutes;

    @Column(name = "jwt_token_expiration_hours")
    private Integer jwtTokenExpirationHours;

    @Column(name = "max_login_attempts")
    private Integer maxLoginAttempts;

    @Column(name = "lockout_duration_minutes")
    private Integer lockoutDurationMinutes;

    @Column(name = "enable_email_login")
    private Boolean enableEmailLogin;

    // Default Quotas
    @Column(name = "default_max_users_per_client")
    private Integer defaultMaxUsersPerClient;

    @Column(name = "default_max_workflows_per_client")
    private Integer defaultMaxWorkflowsPerClient;

    @Column(name = "default_storage_quota_mb")
    private Integer defaultStorageQuotaMb;

    // Email/SMTP Configuration (consider encryption for password)
    @Column(name = "smtp_host")
    private String smtpHost;

    @Column(name = "smtp_port")
    private Integer smtpPort;

    @Column(name = "smtp_username")
    private String smtpUsername;

    @Column(name = "smtp_password") // Should be encrypted
    private String smtpPassword;

    @Column(name = "smtp_enable_tls")
    private Boolean smtpEnableTls;

    @Column(name = "smtp_from_email")
    private String smtpFromEmail;

    @Column(name = "smtp_from_name")
    private String smtpFromName;

    // System Configuration
    @Column(name = "maintenance_mode")
    private Boolean maintenanceMode;

    @Column(name = "maintenance_message", columnDefinition = "TEXT")
    private String maintenanceMessage;

    @Column(name = "system_status")
    private String systemStatus;
}
