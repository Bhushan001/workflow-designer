package com.workflow.auth.config;

import com.workflow.auth.repository.PlatformSettingsRepository;
import com.workflow.auth.service.PlatformSettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SettingsInitializer implements ApplicationListener<ContextRefreshedEvent> {
    
    private final PlatformSettingsRepository settingsRepository;
    private final PlatformSettingsService settingsService;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (settingsRepository.count() == 0) {
            log.info("No platform settings found. Creating default settings...");
            settingsService.initializeDefaultSettings();
        }
    }
}
