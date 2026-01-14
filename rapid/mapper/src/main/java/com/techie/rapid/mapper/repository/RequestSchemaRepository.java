package com.techie.rapid.mapper.repository;

import com.techie.rapid.mapper.entity.RequestSchema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RequestSchemaRepository extends JpaRepository<RequestSchema, UUID> {
}

