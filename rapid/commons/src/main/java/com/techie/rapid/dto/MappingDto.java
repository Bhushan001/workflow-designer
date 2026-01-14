package com.techie.rapid.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class MappingDto {
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
    private UUID requestSchemaId;

    public MappingDto() {}

    public MappingDto(UUID id, String name, String description, String schemaFileName, LocalDateTime createdOn, UUID createdBy, LocalDateTime updatedOn, UUID updatedBy, UUID requestSchemaId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.schemaFileName = schemaFileName;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.requestSchemaId = requestSchemaId;
    }
}
