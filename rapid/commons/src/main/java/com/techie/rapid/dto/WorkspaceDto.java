package com.techie.rapid.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class WorkspaceDto {
    private UUID id;
    private String name;
    private String description;
    private UUID ownerId;
    private UUID createdBy;
    private String createdByName;
    private LocalDateTime createdOn;
    private UUID updatedBy;
    private String updatedByName;
    private LocalDateTime updatedOn;
}
