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

    /**
     * Get users by client ID with pagination
     * CLIENT_ADMIN can see users for their client
     */
    @GetMapping("/users/client/{clientId}/paginated")
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'CLIENT_ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getUsersByClientIdPaginated(
            @PathVariable UUID clientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        // TODO: Add authorization check - CLIENT_ADMIN should only access their own client's users
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDto> usersPage = userService.getUsersByClientIdWithPagination(clientId, pageable, search);
        ApiResponse<Page<UserDto>> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), usersPage);
        return ResponseEntity.ok(response);
    }

    /**
     * Get a single user by ID
     * PLATFORM_ADMIN can access any user
     * CLIENT_ADMIN can only access users from their own client
     */
    @GetMapping("/users/{id}")
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'CLIENT_ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable UUID id) {
        // Check if user is PLATFORM_ADMIN
        org.springframework.security.core.Authentication authentication = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        
        boolean isPlatformAdmin = authentication.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("PLATFORM_ADMIN"));
        
        // If not PLATFORM_ADMIN, verify the user being accessed belongs to the current user's client
        if (!isPlatformAdmin) {
            java.util.Optional<com.workflow.auth.entity.User> currentUserOpt = userService.getCurrentUser();
            if (currentUserOpt.isEmpty() || currentUserOpt.get().getClient() == null) {
                throw new org.springframework.security.access.AccessDeniedException("Access Denied: User does not have a client assigned");
            }
            
            UserDto targetUserDto = userService.getUserDtoById(id);
            if (targetUserDto == null) {
                ApiResponse<UserDto> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), "User not found", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            UUID currentUserClientId = currentUserOpt.get().getClient().getId();
            if (targetUserDto.getClientId() == null || !targetUserDto.getClientId().equals(currentUserClientId)) {
                throw new org.springframework.security.access.AccessDeniedException("Access Denied: You can only access users from your own client");
            }
            
            ApiResponse<UserDto> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), targetUserDto);
            return ResponseEntity.ok(response);
        }
        
        // PLATFORM_ADMIN can access any user
        UserDto userDto = userService.getUserDtoById(id);
        if (userDto == null) {
            ApiResponse<UserDto> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), "User not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        ApiResponse<UserDto> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), userDto);
        return ResponseEntity.ok(response);
    }

    /**
     * Update a user
     * PLATFORM_ADMIN can update any user
     * CLIENT_ADMIN can only update users from their own client
     */
    @PutMapping("/users/{id}")
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'CLIENT_ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(@PathVariable UUID id, @RequestBody AdminCreationRequest request) {
        try {
            // Check if user is PLATFORM_ADMIN
            org.springframework.security.core.Authentication authentication = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            
            boolean isPlatformAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("PLATFORM_ADMIN"));
            
            // If not PLATFORM_ADMIN, verify the user being updated belongs to the current user's client
            if (!isPlatformAdmin) {
                java.util.Optional<com.workflow.auth.entity.User> currentUserOpt = userService.getCurrentUser();
                if (currentUserOpt.isEmpty() || currentUserOpt.get().getClient() == null) {
                    throw new org.springframework.security.access.AccessDeniedException("Access Denied: User does not have a client assigned");
                }
                
                UserDto targetUserDto = userService.getUserDtoById(id);
                if (targetUserDto == null) {
                    ApiResponse<UserDto> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), "User not found", null);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }
                
                UUID currentUserClientId = currentUserOpt.get().getClient().getId();
                if (targetUserDto.getClientId() == null || !targetUserDto.getClientId().equals(currentUserClientId)) {
                    throw new org.springframework.security.access.AccessDeniedException("Access Denied: You can only update users from your own client");
                }
                
                // Ensure CLIENT_ADMIN cannot change the clientId of the user
                if (request.getClientId() != null && !request.getClientId().equals(currentUserClientId)) {
                    throw new org.springframework.security.access.AccessDeniedException("Access Denied: You cannot change a user's client");
                }
            }
            
            // Convert AdminCreationRequest to User entity
            User user = request.toUser();
            
            // Handle clientId - convert to Client entity if provided
            if (request.getClientId() != null) {
                Client client = clientService.getClientById(request.getClientId())
                        .orElseThrow(() -> new ClientNotFoundException(request.getClientId()));
                user.setClient(client);
            }
            
            UserDto updatedUser = userService.updateUser(id, user);
            ApiResponse<UserDto> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), updatedUser);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            ApiResponse<UserDto> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (com.workflow.exceptions.user.UserAlreadyExistsException e) {
            ApiResponse<UserDto> response = new ApiResponse<>(HttpStatus.CONFLICT.value(), e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (ClientNotFoundException e) {
            ApiResponse<UserDto> response = new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            ApiResponse<UserDto> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error updating user: " + e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Delete a user
     * PLATFORM_ADMIN can delete any user
     * CLIENT_ADMIN can only delete users from their own client
     */
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'CLIENT_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        try {
            // Check if user is PLATFORM_ADMIN
            org.springframework.security.core.Authentication authentication = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            
            boolean isPlatformAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("PLATFORM_ADMIN"));
            
            // If not PLATFORM_ADMIN, verify the user being deleted belongs to the current user's client
            if (!isPlatformAdmin) {
                java.util.Optional<com.workflow.auth.entity.User> currentUserOpt = userService.getCurrentUser();
                if (currentUserOpt.isEmpty() || currentUserOpt.get().getClient() == null) {
                    throw new org.springframework.security.access.AccessDeniedException("Access Denied: User does not have a client assigned");
                }
                
                UserDto targetUserDto = userService.getUserDtoById(id);
                if (targetUserDto == null) {
                    ApiResponse<Void> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), "User not found", null);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }
                
                UUID currentUserClientId = currentUserOpt.get().getClient().getId();
                if (targetUserDto.getClientId() == null || !targetUserDto.getClientId().equals(currentUserClientId)) {
                    throw new org.springframework.security.access.AccessDeniedException("Access Denied: You can only delete users from your own client");
                }
            }
            
            userService.deleteUser(id);
            ApiResponse<Void> response = new ApiResponse<>(HttpStatus.OK.value(), "User deleted successfully", null);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            ApiResponse<Void> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            ApiResponse<Void> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error deleting user: " + e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
