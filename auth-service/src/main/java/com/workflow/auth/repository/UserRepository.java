package com.workflow.auth.repository;

import com.workflow.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    
    /**
     * Find user by username or email
     */
    @Query("SELECT u FROM User u WHERE u.username = :identifier OR u.email = :identifier")
    Optional<User> findByUsernameOrEmail(@Param("identifier") String identifier);
    
    /**
     * Find user by username with client eagerly loaded
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.client WHERE u.username = :username")
    Optional<User> findByUsernameWithClient(@Param("username") String username);
    
    /**
     * Find all users with search
     */
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<User> findAllWithSearch(@Param("search") String search, Pageable pageable);
    
    /**
     * Find all users by client ID with pagination
     */
    Page<User> findByClientId(UUID clientId, Pageable pageable);
    
    /**
     * Find all users by client ID with search
     */
    @Query("SELECT u FROM User u WHERE u.client.id = :clientId AND (" +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findByClientIdWithSearch(@Param("clientId") UUID clientId, @Param("search") String search, Pageable pageable);
}
