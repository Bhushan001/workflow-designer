package com.workflow.auth.service;

import com.workflow.auth.dto.PlatformSettingsDto;
import com.workflow.auth.entity.PlatformSettings;
import com.workflow.auth.repository.PlatformSettingsRepository;
import com.workflow.auth.util.SmtpPasswordEncryptor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlatformSettingsService {

    private final PlatformSettingsRepository settingsRepository;
    private final SmtpPasswordEncryptor smtpPasswordEncryptor;

    public PlatformSettingsDto getSettings() {
        Optional<PlatformSettings> settingsOpt = settingsRepository.findFirstByOrderByCreatedOnAsc();
        
        if (settingsOpt.isEmpty()) {
            log.info("No platform settings found. Initializing default settings...");
            return initializeDefaultSettings();
        }
        
        return convertToDto(settingsOpt.get());
    }

    @Transactional
    public PlatformSettingsDto updateSettings(PlatformSettingsDto dto) {
        Optional<PlatformSettings> settingsOpt = settingsRepository.findFirstByOrderByCreatedOnAsc();
        
        PlatformSettings settings;
        if (settingsOpt.isEmpty()) {
            settings = new PlatformSettings();
            // Initialize with defaults if creating new
            initializeDefaults(settings);
        } else {
            settings = settingsOpt.get();
        }
        
        // Update fields from DTO (only update non-null fields)
        updateEntityFromDto(settings, dto);
        
        PlatformSettings saved = settingsRepository.save(settings);
        log.info("Platform settings updated successfully");
        return convertToDto(saved);
    }

    @Transactional
    public PlatformSettingsDto initializeDefaultSettings() {
        if (settingsRepository.count() > 0) {
            log.info("Settings already exist, returning existing settings");
            return getSettings();
        }
        
        PlatformSettings settings = new PlatformSettings();
        initializeDefaults(settings);
        
        PlatformSettings saved = settingsRepository.save(settings);
        log.info("Default platform settings initialized");
        return convertToDto(saved);
    }

    private void initializeDefaults(PlatformSettings settings) {
        // General Settings
        if (settings.getPlatformName() == null) {
            settings.setPlatformName("Workflow Designer");
        }
        if (settings.getDefaultTimezone() == null) {
            settings.setDefaultTimezone("UTC");
        }
        if (settings.getDefaultLocale() == null) {
            settings.setDefaultLocale("en");
        }
        
        // Security Settings
        if (settings.getPasswordMinLength() == null) {
            settings.setPasswordMinLength(8);
        }
        if (settings.getPasswordRequireUppercase() == null) {
            settings.setPasswordRequireUppercase(true);
        }
        if (settings.getPasswordRequireLowercase() == null) {
            settings.setPasswordRequireLowercase(true);
        }
        if (settings.getPasswordRequireNumbers() == null) {
            settings.setPasswordRequireNumbers(true);
        }
        if (settings.getPasswordRequireSpecialChars() == null) {
            settings.setPasswordRequireSpecialChars(true);
        }
        if (settings.getSessionTimeoutMinutes() == null) {
            settings.setSessionTimeoutMinutes(30);
        }
        if (settings.getJwtTokenExpirationHours() == null) {
            settings.setJwtTokenExpirationHours(24);
        }
        if (settings.getMaxLoginAttempts() == null) {
            settings.setMaxLoginAttempts(5);
        }
        if (settings.getLockoutDurationMinutes() == null) {
            settings.setLockoutDurationMinutes(15);
        }
        if (settings.getEnableEmailLogin() == null) {
            settings.setEnableEmailLogin(true);
        }
        
        // SMTP Settings
        if (settings.getSmtpPort() == null) {
            settings.setSmtpPort(587);
        }
        if (settings.getSmtpEnableTls() == null) {
            settings.setSmtpEnableTls(true);
        }
        
        // System Configuration
        if (settings.getMaintenanceMode() == null) {
            settings.setMaintenanceMode(false);
        }
        if (settings.getSystemStatus() == null) {
            settings.setSystemStatus("ACTIVE");
        }
    }

    private void updateEntityFromDto(PlatformSettings entity, PlatformSettingsDto dto) {
        // General Settings
        if (dto.getPlatformName() != null) {
            entity.setPlatformName(dto.getPlatformName());
        }
        if (dto.getPlatformEmail() != null) {
            entity.setPlatformEmail(dto.getPlatformEmail());
        }
        if (dto.getDefaultTimezone() != null) {
            entity.setDefaultTimezone(dto.getDefaultTimezone());
        }
        if (dto.getDefaultLocale() != null) {
            entity.setDefaultLocale(dto.getDefaultLocale());
        }
        if (dto.getPlatformDescription() != null) {
            entity.setPlatformDescription(dto.getPlatformDescription());
        }
        
        // Security Settings
        if (dto.getPasswordMinLength() != null) {
            entity.setPasswordMinLength(dto.getPasswordMinLength());
        }
        if (dto.getPasswordRequireUppercase() != null) {
            entity.setPasswordRequireUppercase(dto.getPasswordRequireUppercase());
        }
        if (dto.getPasswordRequireLowercase() != null) {
            entity.setPasswordRequireLowercase(dto.getPasswordRequireLowercase());
        }
        if (dto.getPasswordRequireNumbers() != null) {
            entity.setPasswordRequireNumbers(dto.getPasswordRequireNumbers());
        }
        if (dto.getPasswordRequireSpecialChars() != null) {
            entity.setPasswordRequireSpecialChars(dto.getPasswordRequireSpecialChars());
        }
        if (dto.getSessionTimeoutMinutes() != null) {
            entity.setSessionTimeoutMinutes(dto.getSessionTimeoutMinutes());
        }
        if (dto.getJwtTokenExpirationHours() != null) {
            entity.setJwtTokenExpirationHours(dto.getJwtTokenExpirationHours());
        }
        if (dto.getMaxLoginAttempts() != null) {
            entity.setMaxLoginAttempts(dto.getMaxLoginAttempts());
        }
        if (dto.getLockoutDurationMinutes() != null) {
            entity.setLockoutDurationMinutes(dto.getLockoutDurationMinutes());
        }
        if (dto.getEnableEmailLogin() != null) {
            entity.setEnableEmailLogin(dto.getEnableEmailLogin());
        }
        
        // Default Quotas
        if (dto.getDefaultMaxUsersPerClient() != null) {
            entity.setDefaultMaxUsersPerClient(dto.getDefaultMaxUsersPerClient());
        }
        if (dto.getDefaultMaxWorkflowsPerClient() != null) {
            entity.setDefaultMaxWorkflowsPerClient(dto.getDefaultMaxWorkflowsPerClient());
        }
        if (dto.getDefaultStorageQuotaMb() != null) {
            entity.setDefaultStorageQuotaMb(dto.getDefaultStorageQuotaMb());
        }
        
        // Email/SMTP Configuration
        if (dto.getSmtpHost() != null) {
            entity.setSmtpHost(dto.getSmtpHost());
        }
        if (dto.getSmtpPort() != null) {
            entity.setSmtpPort(dto.getSmtpPort());
        }
        if (dto.getSmtpUsername() != null) {
            entity.setSmtpUsername(dto.getSmtpUsername());
        }
        // Encrypt SMTP password before storing
        // Note: Only encrypt if a new password is provided (not empty string)
        // If password field is present in DTO (even if empty), it means user wants to update it
        // We need a way to distinguish between "update with new password" and "keep existing password"
        // For now, we'll check if smtpPassword is provided and not empty
        if (dto.getSmtpPassword() != null && !dto.getSmtpPassword().trim().isEmpty()) {
            String encryptedPassword = smtpPasswordEncryptor.encrypt(dto.getSmtpPassword());
            entity.setSmtpPassword(encryptedPassword);
            log.debug("SMTP password encrypted and stored");
        }
        // If smtpPassword is null or empty, keep the existing password (don't update)
        if (dto.getSmtpFromEmail() != null) {
            entity.setSmtpFromEmail(dto.getSmtpFromEmail());
        }
        if (dto.getSmtpFromName() != null) {
            entity.setSmtpFromName(dto.getSmtpFromName());
        }
        if (dto.getSmtpEnableTls() != null) {
            entity.setSmtpEnableTls(dto.getSmtpEnableTls());
        }
        
        // System Configuration
        if (dto.getMaintenanceMode() != null) {
            entity.setMaintenanceMode(dto.getMaintenanceMode());
        }
        if (dto.getMaintenanceMessage() != null) {
            entity.setMaintenanceMessage(dto.getMaintenanceMessage());
        }
        if (dto.getSystemStatus() != null) {
            entity.setSystemStatus(dto.getSystemStatus());
        }
    }

    private PlatformSettingsDto convertToDto(PlatformSettings settings) {
        if (settings == null) {
            return null;
        }
        
        PlatformSettingsDto dto = new PlatformSettingsDto();
        dto.setId(settings.getId());
        
        // General Settings
        dto.setPlatformName(settings.getPlatformName());
        dto.setPlatformEmail(settings.getPlatformEmail());
        dto.setDefaultTimezone(settings.getDefaultTimezone());
        dto.setDefaultLocale(settings.getDefaultLocale());
        dto.setPlatformDescription(settings.getPlatformDescription());
        
        // Security Settings
        dto.setPasswordMinLength(settings.getPasswordMinLength());
        dto.setPasswordRequireUppercase(settings.getPasswordRequireUppercase());
        dto.setPasswordRequireLowercase(settings.getPasswordRequireLowercase());
        dto.setPasswordRequireNumbers(settings.getPasswordRequireNumbers());
        dto.setPasswordRequireSpecialChars(settings.getPasswordRequireSpecialChars());
        dto.setSessionTimeoutMinutes(settings.getSessionTimeoutMinutes());
        dto.setJwtTokenExpirationHours(settings.getJwtTokenExpirationHours());
        dto.setMaxLoginAttempts(settings.getMaxLoginAttempts());
        dto.setLockoutDurationMinutes(settings.getLockoutDurationMinutes());
        dto.setEnableEmailLogin(settings.getEnableEmailLogin());
        
        // Default Quotas
        dto.setDefaultMaxUsersPerClient(settings.getDefaultMaxUsersPerClient());
        dto.setDefaultMaxWorkflowsPerClient(settings.getDefaultMaxWorkflowsPerClient());
        dto.setDefaultStorageQuotaMb(settings.getDefaultStorageQuotaMb());
        
        // Email/SMTP Configuration (do NOT include smtpPassword)
        dto.setSmtpHost(settings.getSmtpHost());
        dto.setSmtpPort(settings.getSmtpPort());
        dto.setSmtpUsername(settings.getSmtpUsername());
        dto.setSmtpFromEmail(settings.getSmtpFromEmail());
        dto.setSmtpFromName(settings.getSmtpFromName());
        dto.setSmtpEnableTls(settings.getSmtpEnableTls());
        
        // System Configuration
        dto.setMaintenanceMode(settings.getMaintenanceMode());
        dto.setMaintenanceMessage(settings.getMaintenanceMessage());
        dto.setSystemStatus(settings.getSystemStatus());
        
        // Metadata
        dto.setCreatedOn(settings.getCreatedOn());
        dto.setUpdatedOn(settings.getUpdatedOn());
        dto.setCreatedBy(settings.getCreatedBy());
        dto.setUpdatedBy(settings.getUpdatedBy());
        
        return dto;
    }

    @Transactional
    public PlatformSettingsDto resetToDefaults() {
        Optional<PlatformSettings> settingsOpt = settingsRepository.findFirstByOrderByCreatedOnAsc();
        
        PlatformSettings settings;
        if (settingsOpt.isEmpty()) {
            settings = new PlatformSettings();
        } else {
            settings = settingsOpt.get();
        }
        
        // Reset all fields to defaults
        initializeDefaults(settings);
        // Clear optional fields
        settings.setPlatformEmail(null);
        settings.setPlatformDescription(null);
        settings.setDefaultMaxUsersPerClient(null);
        settings.setDefaultMaxWorkflowsPerClient(null);
        settings.setDefaultStorageQuotaMb(null);
        settings.setSmtpHost(null);
        settings.setSmtpUsername(null);
        settings.setSmtpPassword(null);
        settings.setSmtpFromEmail(null);
        settings.setSmtpFromName(null);
        settings.setMaintenanceMessage(null);
        
        PlatformSettings saved = settingsRepository.save(settings);
        log.info("Platform settings reset to defaults");
        return convertToDto(saved);
    }
}
