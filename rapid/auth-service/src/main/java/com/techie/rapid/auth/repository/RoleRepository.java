package com.techie.rapid.auth.repository;

import com.techie.rapid.auth.entity.Role;
import com.techie.rapid.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(String roleName);
    Optional<Role> findByCode(String roleCode);
}
