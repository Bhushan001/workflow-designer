package com.techie.rapid.designer.repository;

import com.techie.rapid.designer.entity.Workspace;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {

    Page<Workspace> findByOwnerId(UUID ownerId, Pageable pageable);
    Optional<Workspace> findByName(String name);
}