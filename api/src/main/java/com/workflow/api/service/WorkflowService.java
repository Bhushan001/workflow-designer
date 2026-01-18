package com.workflow.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.workflow.api.dto.WorkflowDefinition;
import com.workflow.api.entity.Workflow;
import com.workflow.api.repository.WorkflowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkflowService {
    
    private final WorkflowRepository workflowRepository;
    public final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Validate workflow name is not empty
     */
    private void validateWorkflowName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Workflow name is required and cannot be empty.");
        }
    }
    
    /**
     * Create a new workflow
     */
    @Transactional
    public Workflow createWorkflow(Workflow workflow, String ownerId) {
        validateWorkflowName(workflow.getName());
        
        workflow.setOwnerId(ownerId);
        
        // Check if workflow with same name exists for this owner
        if (workflowRepository.existsByNameAndOwnerId(workflow.getName(), ownerId)) {
            throw new IllegalArgumentException("Workflow with name '" + workflow.getName() + "' already exists for this user.");
        }
        
        // Generate ID if not provided
        if (workflow.getId() == null || workflow.getId().isEmpty()) {
            workflow.setId(UUID.randomUUID().toString());
        }
        
        // Set timestamps
        workflow.setCreatedAt(LocalDateTime.now());
        workflow.setUpdatedAt(LocalDateTime.now());
        
        return workflowRepository.save(workflow);
    }
    
    /**
     * Get workflow by ID
     */
    public Optional<Workflow> getWorkflowById(String id) {
        return workflowRepository.findById(id);
    }
    
    /**
     * Get workflow by ID and owner ID (for authorization)
     */
    public Optional<Workflow> getWorkflowByIdAndOwnerId(String id, String ownerId) {
        Optional<Workflow> workflow = workflowRepository.findById(id);
        if (workflow.isPresent() && workflow.get().getOwnerId().equals(ownerId)) {
            return workflow;
        }
        return Optional.empty();
    }
    
    /**
     * Get all workflows for owner
     */
    public Page<Workflow> getAllWorkflowsByOwner(String ownerId, Pageable pageable) {
        return workflowRepository.findByOwnerId(ownerId, pageable);
    }
    
    /**
     * Get all workflows for a client
     */
    public Page<Workflow> getAllWorkflowsByClient(String clientId, Pageable pageable) {
        return workflowRepository.findByClientId(clientId, pageable);
    }
    
    /**
     * Search workflows by name for owner
     */
    public Page<Workflow> searchWorkflowsByOwner(String ownerId, String search, Pageable pageable) {
        return workflowRepository.findByOwnerIdAndNameContainingIgnoreCase(ownerId, search, pageable);
    }
    
    /**
     * Update workflow
     */
    @Transactional
    public Workflow updateWorkflow(String id, Workflow workflowDetails, String ownerId) {
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Workflow with id '" + id + "' not found."));
        
        if (!workflow.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("You do not have permission to update this workflow.");
        }
        
        // Validate name if it's being changed
        if (workflowDetails.getName() != null && !workflowDetails.getName().equals(workflow.getName())) {
            validateWorkflowName(workflowDetails.getName());
            
            // Check if new name already exists for this owner
            if (workflowRepository.existsByNameAndOwnerId(workflowDetails.getName(), ownerId)) {
                throw new IllegalArgumentException("Workflow with name '" + workflowDetails.getName() + "' already exists for this user.");
            }
            workflow.setName(workflowDetails.getName());
        }
        
        if (workflowDetails.getDescription() != null) {
            workflow.setDescription(workflowDetails.getDescription());
        }
        
        if (workflowDetails.getWorkflowDefinition() != null) {
            workflow.setWorkflowDefinition(workflowDetails.getWorkflowDefinition());
        }
        
        if (workflowDetails.getStatus() != null) {
            workflow.setStatus(workflowDetails.getStatus());
        }
        
        if (workflowDetails.getClientId() != null) {
            workflow.setClientId(workflowDetails.getClientId());
        }
        
        workflow.setUpdatedAt(LocalDateTime.now());
        
        return workflowRepository.save(workflow);
    }
    
    /**
     * Delete workflow
     */
    @Transactional
    public void deleteWorkflow(String id, String ownerId) {
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Workflow with id '" + id + "' not found."));
        
        if (!workflow.getOwnerId().equals(ownerId)) {
            throw new IllegalArgumentException("You do not have permission to delete this workflow.");
        }
        
        workflowRepository.delete(workflow);
    }
    
    /**
     * Convert Workflow entity to WorkflowDefinition DTO
     */
    public WorkflowDefinition toWorkflowDefinition(Workflow workflow) {
        try {
            if (workflow.getWorkflowDefinition() != null && !workflow.getWorkflowDefinition().isEmpty()) {
                return objectMapper.readValue(workflow.getWorkflowDefinition(), WorkflowDefinition.class);
            }
            // Return empty workflow definition if not stored
            WorkflowDefinition def = new WorkflowDefinition();
            def.setId(workflow.getId());
            def.setName(workflow.getName());
            def.setCreatedAt(workflow.getCreatedAt().toString());
            def.setUpdatedAt(workflow.getUpdatedAt().toString());
            return def;
        } catch (Exception e) {
            log.error("Error converting workflow to definition", e);
            throw new RuntimeException("Failed to parse workflow definition", e);
        }
    }
    
    /**
     * Convert WorkflowDefinition DTO to JSON string for storage
     */
    public String toWorkflowDefinitionJson(WorkflowDefinition definition) {
        try {
            return objectMapper.writeValueAsString(definition);
        } catch (Exception e) {
            log.error("Error converting workflow definition to JSON", e);
            throw new RuntimeException("Failed to serialize workflow definition", e);
        }
    }
}
