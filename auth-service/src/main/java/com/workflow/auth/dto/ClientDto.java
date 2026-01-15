package com.workflow.auth.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ClientDto {
    private UUID id;
    private String clientCode;
    private String name;
    private String description;
    private String contactEmail;
    private String contactPhone;
    private String contactPersonName;
    private String websiteUrl;
    private String industry;
    private String companySize;
    private String status;
    private String timeZone;
    private String locale;
    private Integer maxUsers;
    private Integer maxWorkflows;
    private String billingContactEmail;
    private String internalNotes;
    private UUID createdBy;
    private String createdByName;
    private LocalDateTime createdOn;
    private UUID updatedBy;
    private String updatedByName;
    private LocalDateTime updatedOn;

    public ClientDto(UUID id, String clientCode, String name, String description, 
                    String contactEmail, String contactPhone, String contactPersonName,
                    String websiteUrl, String industry, String companySize, String status,
                    String timeZone, String locale, Integer maxUsers, Integer maxWorkflows,
                    String billingContactEmail, String internalNotes,
                    LocalDateTime createdOn, LocalDateTime updatedOn, UUID createdBy, UUID updatedBy) {
        this.id = id;
        this.clientCode = clientCode;
        this.name = name;
        this.description = description;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.contactPersonName = contactPersonName;
        this.websiteUrl = websiteUrl;
        this.industry = industry;
        this.companySize = companySize;
        this.status = status;
        this.timeZone = timeZone;
        this.locale = locale;
        this.maxUsers = maxUsers;
        this.maxWorkflows = maxWorkflows;
        this.billingContactEmail = billingContactEmail;
        this.internalNotes = internalNotes;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
    }

    // Default constructor for compatibility
    public ClientDto() {
    }
}
