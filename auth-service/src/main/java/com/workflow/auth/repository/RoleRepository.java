package com.workflow.auth.repository;

import com.workflow.auth.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(String roleName);
    Optional<Role> findByCode(String roleCode);
}
