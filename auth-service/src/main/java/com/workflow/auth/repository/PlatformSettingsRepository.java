package com.workflow.auth.repository;

import com.workflow.auth.entity.PlatformSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlatformSettingsRepository extends JpaRepository<PlatformSettings, UUID> {
    // Get the first/only record (singleton pattern)
    // Since there's typically only one settings record, we get the first one
    Optional<PlatformSettings> findFirstByOrderByCreatedOnAsc();
}
