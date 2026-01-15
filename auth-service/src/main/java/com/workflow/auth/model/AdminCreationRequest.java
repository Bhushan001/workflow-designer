package com.workflow.auth.model;

import com.workflow.auth.entity.User;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class AdminCreationRequest {

    @NotBlank(message = "Username is required")
    private String username;
    
    private String email;
    
    private String password; // Optional - if not provided, will be auto-generated
    
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String country;
    private UUID clientId;

    public User toUser() {
        User user = new User();
        user.setUsername(this.username);
        user.setEmail(this.email);
        user.setPassword(this.password);
        user.setFirstName(this.firstName);
        user.setLastName(this.lastName);
        user.setBirthDate(this.birthDate);
        user.setCountry(this.country);
        return user;
    }
}
