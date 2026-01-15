package com.workflow.auth.util;

import com.workflow.auth.dto.PlatformSettingsDto;
import com.workflow.auth.service.PlatformSettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class PasswordPolicyValidator {
    private final PlatformSettingsService settingsService;

    public ValidationResult validatePassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            ValidationResult result = new ValidationResult(false);
            result.addError("Password cannot be empty");
            return result;
        }

        PlatformSettingsDto settings = settingsService.getSettings();
        List<String> errors = new ArrayList<>();
        
        if (settings.getPasswordMinLength() != null && password.length() < settings.getPasswordMinLength()) {
            errors.add("Password must be at least " + settings.getPasswordMinLength() + " characters");
        }
        
        if (Boolean.TRUE.equals(settings.getPasswordRequireUppercase()) && !password.matches(".*[A-Z].*")) {
            errors.add("Password must contain at least one uppercase letter");
        }
        
        if (Boolean.TRUE.equals(settings.getPasswordRequireLowercase()) && !password.matches(".*[a-z].*")) {
            errors.add("Password must contain at least one lowercase letter");
        }
        
        if (Boolean.TRUE.equals(settings.getPasswordRequireNumbers()) && !password.matches(".*[0-9].*")) {
            errors.add("Password must contain at least one number");
        }
        
        if (Boolean.TRUE.equals(settings.getPasswordRequireSpecialChars()) && !password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            errors.add("Password must contain at least one special character");
        }
        
        return new ValidationResult(errors.isEmpty(), errors);
    }

    /**
     * Validates password and throws IllegalArgumentException if invalid
     * @param password the password to validate
     * @throws IllegalArgumentException if password doesn't meet policy requirements
     */
    public void validatePasswordOrThrow(String password) {
        ValidationResult result = validatePassword(password);
        if (!result.isValid()) {
            throw new IllegalArgumentException(result.getErrorMessage());
        }
    }
}
