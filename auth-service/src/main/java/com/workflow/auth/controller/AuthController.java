package com.workflow.auth.controller;

import com.workflow.auth.entity.Client;
import com.workflow.auth.entity.User;
import com.workflow.auth.model.AdminCreationRequest;
import com.workflow.auth.model.LoginRequest;
import com.workflow.auth.model.LoginResponse;
import com.workflow.auth.model.UserCreationResponse;
import com.workflow.auth.service.ClientService;
import com.workflow.auth.service.UserService;
import com.workflow.dto.UserDto;
import com.workflow.enums.UserRole;
import com.workflow.exceptions.client.ClientNotFoundException;
import com.workflow.exceptions.user.UserNotFoundException;
import com.workflow.model.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.workflow.exceptions.role.RoleNotFoundException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final ClientService clientService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<UserCreationResponse>> signup(@Valid @RequestBody AdminCreationRequest request) throws RoleNotFoundException {
        return createUserWithRole(request, String.valueOf(UserRole.CLIENT_USER));
    }

    /**
     * PLATFORM_ADMIN endpoint: Create a CLIENT_ADMIN user for a specific client
     * Only PLATFORM_ADMIN can create CLIENT_ADMIN users
     */
    @PostMapping("/createClientAdmin")
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<UserCreationResponse>> createClientAdmin(@Valid @RequestBody AdminCreationRequest request) throws RoleNotFoundException {
        if (request.getClientId() == null) {
            throw new IllegalArgumentException("Client ID is required for CLIENT_ADMIN user");
        }
        return createUserWithRole(request, String.valueOf(UserRole.CLIENT_ADMIN));
    }

    /**
     * CLIENT_ADMIN endpoint: Create a CLIENT_USER for their client
     * Only CLIENT_ADMIN can create CLIENT_USER users for their own client
     */
    @PostMapping("/createClientUser")
    @PreAuthorize("hasAuthority('CLIENT_ADMIN')")
    public ResponseEntity<ApiResponse<UserCreationResponse>> createClientUser(@Valid @RequestBody AdminCreationRequest request) throws RoleNotFoundException {
        // TODO: Add validation to ensure clientId matches the authenticated user's client
        if (request.getClientId() == null) {
            throw new IllegalArgumentException("Client ID is required for CLIENT_USER");
        }
        return createUserWithRole(request, String.valueOf(UserRole.CLIENT_USER));
    }

    /**
     * Create a PLATFORM_ADMIN user
     * Open endpoint for bootstrap - allows creating the first PLATFORM_ADMIN user with PLATFORM clientId
     * After bootstrap, this should be restricted to PLATFORM_ADMIN only
     * PLATFORM_ADMIN users are typically associated with the PLATFORM client
     */
    @PostMapping("/createPlatformAdmin")
    public ResponseEntity<ApiResponse<UserCreationResponse>> createPlatformAdmin(@Valid @RequestBody AdminCreationRequest request) throws RoleNotFoundException {
        // PLATFORM_ADMIN can be created with or without a clientId
        // For bootstrap, they should be created with the PLATFORM clientId
        return createUserWithRole(request, String.valueOf(UserRole.PLATFORM_ADMIN));
    }

    private ResponseEntity<ApiResponse<UserCreationResponse>> createUserWithRole(AdminCreationRequest request, String roleCode) throws RoleNotFoundException {
        Client client = null;
        if (request.getClientId() != null) {
            client = clientService.getClientById(request.getClientId())
                    .orElseThrow(() -> new ClientNotFoundException(request.getClientId()));
        }
        User user = request.toUser();
        user.setClient(client);
        UserCreationResponse createdUser = userService.registerUser(user, roleCode);
        ApiResponse<UserCreationResponse> response = new ApiResponse<>(HttpStatus.CREATED.value(), HttpStatus.CREATED.getReasonPhrase(), createdUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Update user password
     */
    @PutMapping("/users/{userId}/password")
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'CLIENT_ADMIN')")
    public ResponseEntity<ApiResponse<String>> updatePassword(
            @PathVariable UUID userId,
            @RequestBody Map<String, String> passwordRequest) throws UserNotFoundException {
        String newPassword = passwordRequest.get("password");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        userService.updatePassword(userId, newPassword);
        ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(), "Password updated successfully", null);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Reset user password (generates a new secure password)
     */
    @PostMapping("/users/{userId}/password/reset")
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'CLIENT_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, String>>> resetPassword(@PathVariable UUID userId) throws UserNotFoundException {
        String newPassword = userService.resetPassword(userId);
        Map<String, String> result = Map.of("password", newPassword);
        ApiResponse<Map<String, String>> response = new ApiResponse<>(HttpStatus.OK.value(), "Password reset successfully", result);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = userService.login(loginRequest);
        ApiResponse<LoginResponse> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), loginResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all users with pagination
     * PLATFORM_ADMIN can see all users
     */
    @GetMapping("/users/paginated")
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getAllUsersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDto> usersPage = userService.getAllUsersWithPagination(pageable, search);
        ApiResponse<Page<UserDto>> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), usersPage);
        return ResponseEntity.ok(response);
    }
}
