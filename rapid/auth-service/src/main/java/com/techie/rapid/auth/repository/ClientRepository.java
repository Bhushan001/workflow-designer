package com.techie.rapid.auth.repository;

import com.techie.rapid.auth.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ClientRepository extends JpaRepository<Client, UUID> {
    // No need to add custom methods for basic create and delete operations
}
