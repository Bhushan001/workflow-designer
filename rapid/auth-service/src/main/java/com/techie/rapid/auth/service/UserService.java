package com.techie.rapid.auth.service;

import com.techie.rapid.auth.entity.Role;
import com.techie.rapid.auth.entity.User;
import com.techie.rapid.auth.model.LoginRequest;
import com.techie.rapid.auth.model.LoginResponse;
import com.techie.rapid.auth.model.UserProfile;
import com.techie.rapid.auth.repository.RoleRepository;
import com.techie.rapid.auth.repository.UserRepository;
import com.techie.rapid.auth.security.JwtUtil;
import com.techie.rapid.dto.UserDto;
import com.techie.rapid.exceptions.GeneralException;
import com.techie.rapid.exceptions.user.InvalidCredentialsException;
import com.techie.rapid.exceptions.user.UserAlreadyExistsException;
import com.techie.rapid.exceptions.user.UserNotFoundException;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import javax.management.relation.RoleNotFoundException;
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
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    @Autowired
    private ModelMapper modelMapper;

    public Page<UserDto> getAllUsersByPage(Claims claims, Pageable pageable) {
        UUID userId = UUID.fromString(claims.get("userId", String.class));
        Page<User> usersPage = userRepository.findAll(pageable);

        List<UserDto> userDtos = usersPage.getContent().stream()
                .map(user -> {
                    UserDto dto = modelMapper.map(user, UserDto.class);
                    String createdByName = getUserDtoById(user.getId()).getUsername();
                    String updatedByName = getUserDtoById(user.getId()).getUsername();

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

    public UserDto getUserDtoById(UUID userId) {
        User user = userRepository.findById(userId).orElse(null);
        if(user == null) {
            return null;
        }
        return modelMapper.map(user, UserDto.class);
    }

    public UserDto registerUser(User user, String roleCode) throws UserAlreadyExistsException, RoleNotFoundException {
        // Check for duplicate username
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException(user.getUsername());
        }
        Optional<Role> roleOptional = roleRepository.findByCode(roleCode);
        if (roleOptional.isEmpty()) {
            throw new RoleNotFoundException(roleCode);
        }
        Role role = roleOptional.get();
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    private UserDto convertToDto(User user) {
        if (user == null) {
            return null; // Or throw an exception
        }
        UserDto dto = new UserDto(
                user.getId(),
                user.getUsername(),
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
//        if (client.getCreatedBy() != null) {
//            try {
//                String createdByName = userService.getUserDtoById(client.getCreatedBy()).getUsername();
//                if (createdByName != null) {
//                    dto.setCreatedByName(createdByName);
//                } else {
//                    log.warn("Username not found for createdBy: {}", client.getCreatedBy());
//                }
//            } catch (Exception e) {
//                log.error("Error fetching createdBy username for id: {}", client.getCreatedBy(), e);
//            }
//        }

//        if (client.getUpdatedBy() != null) {
//            try {
//                String updatedByName = userService.getUserDtoById(client.getUpdatedBy()).getUsername();
//                if (updatedByName != null) {
//                    dto.setUpdatedByName(updatedByName);
//                } else {
//                    log.warn("Username not found for updatedBy: {}", client.getUpdatedBy());
//                }
//            } catch (Exception e) {
//                log.error("Error fetching updatedBy username for id: {}", client.getUpdatedBy(), e);
//            }
//        }
        return dto;
    }

    public LoginResponse login(LoginRequest loginRequest) {
        User user = findAndValidateUser(loginRequest); // Use the optimized method from the previous response

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        Map<String, Object> claims = buildClaims(user);
        String token = jwtUtil.generateToken(user.getUsername(), claims);

        UserProfile userProfile = createUserProfile(user);

        return new LoginResponse(userProfile, token);
    }

    private User findAndValidateUser(LoginRequest loginRequest) {
        return findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new UserNotFoundException(loginRequest.getUsername()));
    }

    private Map<String, Object> buildClaims(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", mapRolesToNames(user.getRoles()));
        claims.put("userId", user.getId());

        if (user.getClient() != null) {
            claims.put("clientId", user.getClient().getId().toString());
            claims.put("clientName", user.getClient().getName());
        } else {
            logger.warn("User {} does not have an associated client.", user.getUsername());
        }

        return claims;
    }

    private UserProfile createUserProfile(User user) {
        return new UserProfile(
                user.getId(),
                user.getUsername(),
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
