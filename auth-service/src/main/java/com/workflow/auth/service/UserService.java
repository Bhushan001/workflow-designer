package com.workflow.auth.service;

import com.workflow.auth.entity.Role;
import com.workflow.auth.entity.User;
import com.workflow.auth.model.LoginRequest;
import com.workflow.auth.model.LoginResponse;
import com.workflow.auth.model.UserCreationResponse;
import com.workflow.auth.model.UserProfile;
import com.workflow.auth.repository.RoleRepository;
import com.workflow.auth.repository.UserRepository;
import com.workflow.auth.security.JwtUtil;
import com.workflow.dto.UserDto;
import com.workflow.exceptions.user.InvalidCredentialsException;
import com.workflow.exceptions.user.UserAlreadyExistsException;
import com.workflow.exceptions.user.UserNotFoundException;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.workflow.exceptions.role.RoleNotFoundException;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    @org.springframework.beans.factory.annotation.Autowired
    private ModelMapper modelMapper;

    public Page<UserDto> getAllUsersByPage(Claims claims, Pageable pageable) {
        UUID userId = UUID.fromString(claims.get("userId", String.class));
        Page<User> usersPage = userRepository.findAll(pageable);

        List<UserDto> userDtos = usersPage.getContent().stream()
                .map(user -> {
                    UserDto dto = modelMapper.map(user, UserDto.class);
                    String createdByName = getUserDtoById(user.getId()) != null ? getUserDtoById(user.getId()).getUsername() : null;
                    String updatedByName = getUserDtoById(user.getId()) != null ? getUserDtoById(user.getId()).getUsername() : null;

                    if(createdByName != null){
                        dto.setCreatedByName(createdByName);
                    } else {
                        log.warn("Username not found for createdBy: {}", dto.getCreatedBy());
                    }

                    if(updatedByName != null){
                        dto.setUpdatedByName(updatedByName);
                    } else {
                        log.warn("Username not found for updatedBy: {}", dto.getUpdatedBy());
                    }
                    dto.setRoles(mapRolesToNames(user.getRoles()));
                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(userDtos, pageable, usersPage.getTotalElements());
    }

    public Page<UserDto> getAllUsersWithPagination(Pageable pageable, String search) {
        Page<User> usersPage;
        
        if (search != null && !search.trim().isEmpty()) {
            usersPage = userRepository.findAllWithSearch(search.trim(), pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }

        List<UserDto> userDtos = usersPage.getContent().stream()
                .map(user -> {
                    UserDto dto = modelMapper.map(user, UserDto.class);
                    String createdByName = null;
                    String updatedByName = null;
                    
                    if (user.getCreatedBy() != null) {
                        Optional<User> createdByUser = userRepository.findById(user.getCreatedBy());
                        createdByName = createdByUser.map(User::getUsername).orElse(null);
                    }
                    
                    if (user.getUpdatedBy() != null) {
                        Optional<User> updatedByUser = userRepository.findById(user.getUpdatedBy());
                        updatedByName = updatedByUser.map(User::getUsername).orElse(null);
                    }

                    if(createdByName != null){
                        dto.setCreatedByName(createdByName);
                    }
                    
                    if(updatedByName != null){
                        dto.setUpdatedByName(updatedByName);
                    }
                    
                    dto.setRoles(mapRolesToNames(user.getRoles()));
                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(userDtos, pageable, usersPage.getTotalElements());
    }

    public UserDto getUserDtoById(UUID userId) {
        User user = userRepository.findById(userId).orElse(null);
        if(user == null) {
            return null;
        }
        return modelMapper.map(user, UserDto.class);
    }

    public UserCreationResponse registerUser(User user, String roleCode) throws UserAlreadyExistsException, RoleNotFoundException {
        // Check for duplicate username
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException(user.getUsername());
        }
        
        // Check for duplicate email if email is provided
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            Optional<User> existingUserByEmail = userRepository.findByEmail(user.getEmail());
            if (existingUserByEmail.isPresent()) {
                throw new UserAlreadyExistsException("Email already exists: " + user.getEmail());
            }
        }
        Optional<Role> roleOptional = roleRepository.findByCode(roleCode);
        if (roleOptional.isEmpty()) {
            throw new RoleNotFoundException(roleCode);
        }
        Role role = roleOptional.get();
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);
        
        // Generate password if not provided
        String plainPassword;
        boolean passwordAutoGenerated = false;
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            plainPassword = generateSecurePassword();
            passwordAutoGenerated = true;
            log.info("Auto-generated password for user: {}", user.getUsername());
        } else {
            plainPassword = user.getPassword();
        }
        
        user.setPassword(passwordEncoder.encode(plainPassword));
        User savedUser = userRepository.save(user);
        UserDto userDto = convertToDto(savedUser);
        
        UserCreationResponse response = new UserCreationResponse();
        response.setUser(userDto);
        if (passwordAutoGenerated) {
            response.setPassword(plainPassword);
            response.setPasswordAutoGenerated(true);
        } else {
            response.setPasswordAutoGenerated(false);
        }
        
        return response;
    }
    
    /**
     * Generates a secure random password
     * Format: 12 characters with uppercase, lowercase, numbers, and special characters
     */
    private String generateSecurePassword() {
        String uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowercase = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String special = "!@#$%^&*";
        String allChars = uppercase + lowercase + numbers + special;
        
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(12);
        
        // Ensure at least one character from each category
        password.append(uppercase.charAt(random.nextInt(uppercase.length())));
        password.append(lowercase.charAt(random.nextInt(lowercase.length())));
        password.append(numbers.charAt(random.nextInt(numbers.length())));
        password.append(special.charAt(random.nextInt(special.length())));
        
        // Fill the rest randomly
        for (int i = 4; i < 12; i++) {
            password.append(allChars.charAt(random.nextInt(allChars.length())));
        }
        
        // Shuffle the password
        List<Character> chars = password.chars().mapToObj(c -> (char) c).collect(Collectors.toList());
        Collections.shuffle(chars, random);
        return chars.stream().map(String::valueOf).collect(Collectors.joining());
    }
    
    /**
     * Update user password
     */
    public void updatePassword(UUID userId, String newPassword) throws UserNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId.toString()));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password updated for user: {}", user.getUsername());
    }
    
    /**
     * Reset user password (generates a new secure password)
     */
    public String resetPassword(UUID userId) throws UserNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId.toString()));
        String newPassword = generateSecurePassword();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password reset for user: {}", user.getUsername());
        return newPassword;
    }

    private UserDto convertToDto(User user) {
        if (user == null) {
            return null;
        }
        UserDto dto = new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getBirthDate(),
                user.getCountry(),
                user.getRoles() != null ? user.getRoles().stream()
                        .map(Role::getCode)
                        .collect(Collectors.toList()) : null,
                user.getClient() != null ? user.getClient().getId() : null,
                user.getCreatedOn(),
                user.getUpdatedOn(),
                user.getCreatedBy(),
                user.getUpdatedBy()
        );
        return dto;
    }

    public LoginResponse login(LoginRequest loginRequest) {
        String identifier = loginRequest.getLoginIdentifier();
        if (identifier == null || identifier.trim().isEmpty()) {
            throw new InvalidCredentialsException("Username or email is required");
        }

        User user = findAndValidateUser(identifier);

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException(identifier);
        }

        Map<String, Object> claims = buildClaims(user);
        String token = jwtUtil.generateToken(user.getUsername(), claims);

        UserProfile userProfile = createUserProfile(user);

        return new LoginResponse(userProfile, token);
    }

    private User findAndValidateUser(String identifier) {
        return userRepository.findByUsernameOrEmail(identifier)
                .orElseThrow(() -> new UserNotFoundException(identifier));
    }

    private Map<String, Object> buildClaims(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", mapRolesToNames(user.getRoles()));
        claims.put("userId", user.getId());

        if (user.getClient() != null) {
            claims.put("clientId", user.getClient().getId().toString());
            claims.put("clientName", user.getClient().getName());
        } else {
            log.warn("User {} does not have an associated client.", user.getUsername());
        }

        return claims;
    }

    private UserProfile createUserProfile(User user) {
        return new UserProfile(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                mapRolesToNames(user.getRoles()),
                user.getClient() != null ? user.getClient().getId() : null,
                user.getClient() != null ? user.getClient().getName() : null
        );
    }

    private List<String> mapRolesToNames(Set<Role> roles) {
        return roles.stream().map(Role::getCode).collect(Collectors.toList());
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
