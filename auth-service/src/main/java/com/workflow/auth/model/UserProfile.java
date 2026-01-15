package com.workflow.auth.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class UserProfile {
    private UUID id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private List<String> roles;
    private UUID clientId;
    private String clientName;
}
