package com.techie.rapid.auth.model;

import com.techie.rapid.auth.entity.User;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;
@Data
public class AdminCreationRequest {

    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String country;
    private UUID clientId; // Updated to use clientId

    public User toUser() {
        User user = new User();
        user.setUsername(this.username);
        user.setPassword(this.password); // Password encoding will be handled in the service layer
        user.setFirstName(this.firstName);
        user.setLastName(this.lastName);
        user.setBirthDate(this.birthDate);
        user.setCountry(this.country);
        // Client object will be set in the service layer.
        return user;
    }
}
