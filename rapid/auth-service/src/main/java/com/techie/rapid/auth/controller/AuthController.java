package com.techie.rapid.auth.controller;

import com.techie.rapid.auth.entity.Client;
import com.techie.rapid.auth.entity.User;
import com.techie.rapid.auth.model.AdminCreationRequest;
import com.techie.rapid.auth.model.LoginRequest;
import com.techie.rapid.auth.model.LoginResponse;
import com.techie.rapid.auth.service.ClientService;
import com.techie.rapid.auth.service.UserService;
import com.techie.rapid.dto.UserDto;
import com.techie.rapid.enums.UserRole;
import com.techie.rapid.exceptions.client.ClientNotFoundException;
import com.techie.rapid.model.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.management.relation.RoleNotFoundException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final ClientService clientService;

    @PostMapping("/createUser")
    public ResponseEntity<ApiResponse<UserDto>> createUser(@RequestBody AdminCreationRequest request) throws RoleNotFoundException {
        return createUserWithRole(request, String.valueOf(UserRole.USER));
    }

    @PostMapping("/createManager")
    public ResponseEntity<ApiResponse<UserDto>> createManager(@RequestBody AdminCreationRequest request) throws RoleNotFoundException {
        return createUserWithRole(request, String.valueOf(UserRole.MANAGER));
    }

    @PostMapping("/createAdmin")
    public ResponseEntity<ApiResponse<UserDto>> createAdmin(@RequestBody AdminCreationRequest request) throws RoleNotFoundException {
        return createUserWithRole(request, String.valueOf(UserRole.ADMIN));
    }

    @PostMapping("/createSuperAdmin")
    public ResponseEntity<ApiResponse<UserDto>> createSuperAdmin(@RequestBody AdminCreationRequest request) throws RoleNotFoundException {
        return createUserWithRole(request, String.valueOf(UserRole.SUPER_ADMIN));
    }

    private ResponseEntity<ApiResponse<UserDto>> createUserWithRole(AdminCreationRequest request, String roleCode) throws RoleNotFoundException {
        Client client = clientService.getClientById(request.getClientId()).orElseThrow(() -> new ClientNotFoundException(request.getClientId()));
        User user = request.toUser();
        user.setClient(client);
        UserDto createdUser = userService.registerUser(user, roleCode);
        ApiResponse<UserDto> response = new ApiResponse<>(HttpStatus.CREATED.value(), HttpStatus.CREATED.getReasonPhrase(), createdUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest loginRequest) {
        // Implement login logic here
        LoginResponse loginResponse = userService.login(loginRequest);
        ApiResponse<LoginResponse> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), loginResponse);
        return ResponseEntity.ok(response);
    }
}
