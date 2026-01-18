package com.workflow.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "workflows", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"name", "owner_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Workflow {
    
    @Id
    @Column(name = "id", length = 255)
    private String id;
    
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "owner_id", nullable = false, length = 255)
    private String ownerId;
    
    @Column(name = "client_id", length = 255)
    private String clientId;
    
    @Column(name = "status", nullable = false, length = 50)
    private String status = "DRAFT";
    
    @Column(name = "workflow_definition", columnDefinition = "TEXT")
    private String workflowDefinition; // JSON string
    
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by", length = 255)
    private String createdBy;
    
    @Column(name = "updated_by", length = 255)
    private String updatedBy;
}
