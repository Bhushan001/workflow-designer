package com.workflow.api.repository;

import com.workflow.api.entity.Workflow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, String> {
    Optional<Workflow> findByNameAndOwnerId(String name, String ownerId);
    Page<Workflow> findByOwnerId(String ownerId, Pageable pageable);
    Page<Workflow> findByClientId(String clientId, Pageable pageable);
    Page<Workflow> findByOwnerIdAndNameContainingIgnoreCase(String ownerId, String search, Pageable pageable);
    boolean existsByNameAndOwnerId(String name, String ownerId);
}
