package com.workflow.auth.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ClientDto {
    private UUID id;
    private String name;
    private String description;
    private UUID createdBy;
    private String createdByName;
    private LocalDateTime createdOn;
    private UUID updatedBy;
    private String updatedByName;
    private LocalDateTime updatedOn;

    public ClientDto(UUID id, String name, String description, LocalDateTime createdOn, LocalDateTime updatedOn, UUID createdBy, UUID updatedBy) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
    }
}
