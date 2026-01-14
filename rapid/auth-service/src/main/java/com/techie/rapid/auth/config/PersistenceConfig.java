package com.techie.rapid.auth.config;

import io.jsonwebtoken.Claims;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

@Configuration
@EnableJpaAuditing
public class PersistenceConfig {

    @Bean
    public AuditorAware<UUID> auditorAware() {
        return () -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || authentication.getCredentials() == null) {
                return Optional.empty();
            }
            Object credentials = authentication.getCredentials();
            if (credentials instanceof Claims) {
                try {
                    Claims claims = (Claims) credentials;
                    String userIdString = claims.get("userId", String.class);
                    if (userIdString != null) {
                        return Optional.of(UUID.fromString(userIdString));
                    } else {
                        return Optional.empty();
                    }
                } catch (IllegalArgumentException e) {
                    System.err.println("Error parsing userId to UUID: " + e.getMessage());
                    return Optional.empty();
                }
            } else {
                // Handle cases where credentials are not Claims (e.g., anonymous user)
                return Optional.empty();
            }
        };
    }
}