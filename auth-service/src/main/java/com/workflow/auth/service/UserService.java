package com.workflow.auth.service;

import com.workflow.auth.dto.PlatformSettingsDto;
import com.workflow.auth.entity.Role;
import com.workflow.auth.entity.User;
import com.workflow.auth.model.LoginRequest;
import com.workflow.auth.model.LoginResponse;
import com.workflow.auth.model.UserCreationResponse;
import com.workflow.auth.model.UserProfile;
import com.workflow.auth.repository.RoleRepository;
import com.workflow.auth.repository.UserRepository;
import com.workflow.auth.security.JwtUtil;
import com.workflow.auth.util.PasswordPolicyValidator;
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
    private final PasswordPolicyValidator passwordPolicyValidator;
    private final PlatformSettingsService platformSettingsService;
    @org.springframework.beans.factory.annotation.Autowired
    private ModelMapper modelMapper;

    /**
     * Get current authenticated user from SecurityContext with client eagerly loaded
     */
    public Optional<User> getCurrentUser() {
        try {
            org.springframework.security.core.Authentication authentication = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication != null && authentication.isAuthenticated()) {
                String username = null;
                
                // Handle different principal types
                Object principal = authentication.getPrincipal();
                if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                    username = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
                } else if (principal instanceof String) {
                    // JWT filter sets principal as username (String)
                    username = (String) principal;
                }
                
                if (username != null) {
                    // Use the method that eagerly loads the client relationship
                    return userRepository.findByUsernameWithClient(username);
                }
            }
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error getting current user from SecurityContext", e);
            return Optional.empty();
        }
    }

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

    public Page<UserDto> getUsersByClientIdWithPagination(UUID clientId, Pageable pageable, String search) {
        Page<User> usersPage;
        
        if (search != null && !search.trim().isEmpty()) {
            usersPage = userRepository.findByClientIdWithSearch(clientId, search.trim(), pageable);
        } else {
            usersPage = userRepository.findByClientId(clientId, pageable);
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
            // Validate password against policy
            passwordPolicyValidator.validatePasswordOrThrow(plainPassword);
            log.debug("Password validated against policy for user: {}", user.getUsername());
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
     * Generates a secure random password that complies with current password policy
     * Format: Based on platform settings with uppercase, lowercase, numbers, and special characters
     */
    private String generateSecurePassword() {
        // Get current password policy settings
        PlatformSettingsDto settings = null;
        try {
            settings = platformSettingsService.getSettings();
        } catch (Exception e) {
            log.warn("Could not load platform settings for password generation, using defaults", e);
        }
        
        int minLength = (settings != null && settings.getPasswordMinLength() != null) 
            ? Math.max(settings.getPasswordMinLength(), 12) : 12;
        boolean requireUppercase = settings == null || Boolean.TRUE.equals(settings.getPasswordRequireUppercase());
        boolean requireLowercase = settings == null || Boolean.TRUE.equals(settings.getPasswordRequireLowercase());
        boolean requireNumbers = settings == null || Boolean.TRUE.equals(settings.getPasswordRequireNumbers());
        boolean requireSpecial = settings == null || Boolean.TRUE.equals(settings.getPasswordRequireSpecialChars());
        
        String uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowercase = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String special = "!@#$%^&*";
        String allChars = uppercase + lowercase + numbers + special;
        
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(minLength);
        
        // Ensure at least one character from each required category
        if (requireUppercase) {
            password.append(uppercase.charAt(random.nextInt(uppercase.length())));
        }
        if (requireLowercase) {
            password.append(lowercase.charAt(random.nextInt(lowercase.length())));
        }
        if (requireNumbers) {
            password.append(numbers.charAt(random.nextInt(numbers.length())));
        }
        if (requireSpecial) {
            password.append(special.charAt(random.nextInt(special.length())));
        }
        
        // Fill the rest randomly to meet minimum length
        int currentLength = password.length();
        for (int i = currentLength; i < minLength; i++) {
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
        // Validate password against policy
        passwordPolicyValidator.validatePasswordOrThrow(newPassword);
        
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

    public Optional<User> findById(UUID userId) {
        return userRepository.findById(userId);
    }

    public UserDto updateUser(UUID userId, User userUpdate) throws UserNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId.toString()));
        
        // Update fields from the provided user
        if (userUpdate.getUsername() != null && !userUpdate.getUsername().trim().isEmpty()) {
            // Check if username is changing and if new username already exists
            if (!user.getUsername().equals(userUpdate.getUsername())) {
                Optional<User> existingUser = userRepository.findByUsername(userUpdate.getUsername());
                if (existingUser.isPresent()) {
                    throw new UserAlreadyExistsException(userUpdate.getUsername());
                }
            }
            user.setUsername(userUpdate.getUsername());
        }
        if (userUpdate.getEmail() != null) {
            if (!userUpdate.getEmail().trim().isEmpty()) {
                // Check if email is changing and if new email already exists
                if (user.getEmail() == null || !user.getEmail().equals(userUpdate.getEmail())) {
                    Optional<User> existingUser = userRepository.findByEmail(userUpdate.getEmail());
                    if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
                        throw new UserAlreadyExistsException("Email already exists: " + userUpdate.getEmail());
                    }
                }
                user.setEmail(userUpdate.getEmail());
            } else {
                user.setEmail(null);
            }
        }
        if (userUpdate.getFirstName() != null) {
            user.setFirstName(userUpdate.getFirstName().trim().isEmpty() ? null : userUpdate.getFirstName().trim());
        }
        if (userUpdate.getLastName() != null) {
            user.setLastName(userUpdate.getLastName().trim().isEmpty() ? null : userUpdate.getLastName().trim());
        }
        if (userUpdate.getBirthDate() != null) {
            user.setBirthDate(userUpdate.getBirthDate());
        }
        if (userUpdate.getCountry() != null) {
            user.setCountry(userUpdate.getCountry().trim().isEmpty() ? null : userUpdate.getCountry().trim());
        }
        if (userUpdate.getClient() != null) {
            user.setClient(userUpdate.getClient());
        }
        
        // Handle password update if provided
        if (userUpdate.getPassword() != null && !userUpdate.getPassword().trim().isEmpty()) {
            // Validate password against policy
            passwordPolicyValidator.validatePasswordOrThrow(userUpdate.getPassword());
            user.setPassword(passwordEncoder.encode(userUpdate.getPassword()));
            log.debug("Password updated for user: {}", user.getUsername());
        }
        
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    public void deleteUser(UUID userId) throws UserNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId.toString()));
        
        userRepository.deleteById(userId);
        log.info("User deleted with ID: {}", userId);
    }
}
