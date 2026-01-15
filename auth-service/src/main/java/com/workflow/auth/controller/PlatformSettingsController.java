package com.workflow.auth.controller;

import com.workflow.auth.dto.PasswordPolicyDto;
import com.workflow.auth.dto.PlatformSettingsDto;
import com.workflow.auth.model.SmtpTestRequest;
import com.workflow.auth.model.SmtpTestResponse;
import com.workflow.auth.service.EmailService;
import com.workflow.auth.service.PlatformSettingsService;
import com.workflow.auth.util.SmtpPasswordEncryptor;
import com.workflow.model.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/platform/settings")
@RequiredArgsConstructor
@Slf4j
public class PlatformSettingsController {

    private final PlatformSettingsService settingsService;
    private final EmailService emailService;
    private final SmtpPasswordEncryptor smtpPasswordEncryptor;

    @GetMapping
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<PlatformSettingsDto>> getSettings() {
        try {
            PlatformSettingsDto settings = settingsService.getSettings();
            ApiResponse<PlatformSettingsDto> response = new ApiResponse<>(
                    HttpStatus.OK.value(),
                    HttpStatus.OK.getReasonPhrase(),
                    settings
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching platform settings", e);
            ApiResponse<PlatformSettingsDto> response = new ApiResponse<>(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Error fetching platform settings: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<PlatformSettingsDto>> updateSettings(
            @Valid @RequestBody PlatformSettingsDto dto) {
        try {
            PlatformSettingsDto updated = settingsService.updateSettings(dto);
            ApiResponse<PlatformSettingsDto> response = new ApiResponse<>(
                    HttpStatus.OK.value(),
                    HttpStatus.OK.getReasonPhrase(),
                    updated
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error updating platform settings", e);
            ApiResponse<PlatformSettingsDto> response = new ApiResponse<>(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Error updating platform settings: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/reset")
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<PlatformSettingsDto>> resetToDefaults() {
        try {
            PlatformSettingsDto reset = settingsService.resetToDefaults();
            ApiResponse<PlatformSettingsDto> response = new ApiResponse<>(
                    HttpStatus.OK.value(),
                    HttpStatus.OK.getReasonPhrase(),
                    reset
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error resetting platform settings", e);
            ApiResponse<PlatformSettingsDto> response = new ApiResponse<>(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Error resetting platform settings: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/test-smtp")
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<SmtpTestResponse>> testSmtp(@Valid @RequestBody SmtpTestRequest request) {
        try {
            log.info("Testing SMTP configuration for host: {}, port: {}", request.getSmtpHost(), request.getSmtpPort());
            
            // Create mail sender with provided configuration
            JavaMailSender mailSender = emailService.createMailSender(
                    request.getSmtpHost(),
                    request.getSmtpPort(),
                    request.getSmtpUsername(),
                    request.getSmtpPassword(),
                    request.getSmtpEnableTls()
            );
            
            // Get from email/name from request or use defaults
            String fromEmail = request.getSmtpUsername(); // Use username as default from email
            String fromName = "Workflow Designer";
            
            // Send test email
            emailService.sendTestEmail(mailSender, fromEmail, fromName, request.getTestEmail());
            
            SmtpTestResponse testResponse = new SmtpTestResponse(
                    true,
                    "SMTP connection successful. Test email sent to " + request.getTestEmail()
            );
            
            ApiResponse<SmtpTestResponse> response = new ApiResponse<>(
                    HttpStatus.OK.value(),
                    HttpStatus.OK.getReasonPhrase(),
                    testResponse
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error testing SMTP configuration", e);
            SmtpTestResponse testResponse = new SmtpTestResponse(
                    false,
                    "SMTP test failed: " + e.getMessage()
            );
            ApiResponse<SmtpTestResponse> response = new ApiResponse<>(
                    HttpStatus.BAD_REQUEST.value(),
                    "SMTP test failed",
                    testResponse
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Get password policy - Public endpoint for login/signup forms
     * This endpoint is public and does not require authentication
     */
    @GetMapping("/password-policy")
    public ResponseEntity<ApiResponse<PasswordPolicyDto>> getPasswordPolicy() {
        try {
            PlatformSettingsDto settings = settingsService.getSettings();
            PasswordPolicyDto policy = new PasswordPolicyDto(
                    settings.getPasswordMinLength(),
                    settings.getPasswordRequireUppercase(),
                    settings.getPasswordRequireLowercase(),
                    settings.getPasswordRequireNumbers(),
                    settings.getPasswordRequireSpecialChars()
            );
            ApiResponse<PasswordPolicyDto> response = new ApiResponse<>(
                    HttpStatus.OK.value(),
                    HttpStatus.OK.getReasonPhrase(),
                    policy
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching password policy", e);
            // Return default policy if error occurs
            PasswordPolicyDto defaultPolicy = new PasswordPolicyDto(
                    8,
                    true,
                    true,
                    true,
                    true
            );
            ApiResponse<PasswordPolicyDto> response = new ApiResponse<>(
                    HttpStatus.OK.value(),
                    "Using default password policy",
                    defaultPolicy
            );
            return ResponseEntity.ok(response);
        }
    }
}
