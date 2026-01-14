package com.workflow.auth.config;

import com.workflow.auth.entity.Role;
import com.workflow.auth.repository.RoleRepository;
import com.workflow.enums.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        initializeRoles();
    }

    private void initializeRoles() {
        Arrays.stream(UserRole.values()).forEach(userRole -> {
            String roleCode = userRole.name();
            String roleName = formatRoleName(roleCode);
            
            if (roleRepository.findByCode(roleCode).isEmpty()) {
                Role role = new Role();
                role.setCode(roleCode);
                role.setName(roleName);
                roleRepository.save(role);
                log.info("Initialized role: {} ({})", roleName, roleCode);
            } else {
                log.debug("Role already exists: {}", roleCode);
            }
        });
    }

    private String formatRoleName(String roleCode) {
        // Convert PLATFORM_ADMIN to "Platform Admin", CLIENT_ADMIN to "Client Admin", etc.
        return Arrays.stream(roleCode.split("_"))
                .map(word -> word.charAt(0) + word.substring(1).toLowerCase())
                .reduce((a, b) -> a + " " + b)
                .orElse(roleCode);
    }
}
