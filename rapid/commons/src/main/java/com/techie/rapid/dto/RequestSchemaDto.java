package com.techie.rapid.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class RequestSchemaDto {
    private UUID id;
    private String name;
    private String description;
    private String schemaData;
    private String schemaFileName;
    private UUID createdBy;
    private String createdByName;
    private LocalDateTime createdOn;
    private UUID updatedBy;
    private String updatedByName;
    private LocalDateTime updatedOn;

    public RequestSchemaDto() {}

    public RequestSchemaDto(UUID id, String name, String description, String schemaFileName, LocalDateTime createdOn, UUID createdBy, LocalDateTime updatedOn, UUID updatedBy) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.schemaFileName = schemaFileName;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
    }
}