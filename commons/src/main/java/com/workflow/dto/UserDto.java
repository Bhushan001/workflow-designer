package com.workflow.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class UserDto {
    private UUID id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String country;
    private List<String> roles;
    private UUID clientId;
    private UUID createdBy;
    private String createdByName;
    private LocalDateTime createdOn;
    private UUID updatedBy;
    private String updatedByName;
    private LocalDateTime updatedOn;

    public UserDto(UUID id, String username, String email, String firstName, String lastName, LocalDate birthDate, String country, List<String> roles, UUID clientId, LocalDateTime createdOn, LocalDateTime updatedOn, UUID createdBy, UUID updatedBy) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.country = country;
        this.roles = roles;
        this.clientId = clientId;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
    }

    public UserDto() {
    }
}
