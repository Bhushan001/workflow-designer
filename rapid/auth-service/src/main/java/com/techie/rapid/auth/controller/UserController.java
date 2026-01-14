package com.techie.rapid.auth.controller;

import com.techie.rapid.auth.service.UserService;
import com.techie.rapid.constants.MessageConstants;
import com.techie.rapid.dto.UserDto;
import com.techie.rapid.exceptions.user.UserNotAuthenticatedException;
import com.techie.rapid.model.ApiResponse;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping()
    public ResponseEntity<ApiResponse<Page<UserDto>>> getAllUsers(
            Authentication authentication,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Claims claims = (Claims) authentication.getCredentials();
        Page<UserDto> userDtosPage = userService.getAllUsersByPage(claims, pageable);

        ApiResponse<Page<UserDto>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                HttpStatus.OK.getReasonPhrase(),
                userDtosPage
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable UUID userId) {
        UserDto userDto = userService.getUserDtoById(userId);
        if (userDto != null) {
            return ResponseEntity.ok(userDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(Authentication authentication) {
        System.out.println(authentication);
        // Implement logout logic here
        if (authentication != null) {
            SecurityContextHolder.clearContext();
            ApiResponse<String> response = new ApiResponse<>(
                    HttpStatus.OK.value(),
                    HttpStatus.OK.getReasonPhrase(),
                    MessageConstants.USER_LOGOUT_MESSAGE
            );
            return ResponseEntity.ok(response);
        } else {
            throw new UserNotAuthenticatedException();
        }
    }
}
