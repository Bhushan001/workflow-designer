package com.techie.rapid.mapper.repository;

import com.techie.rapid.mapper.entity.S1Schema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface S1SchemaRepository extends JpaRepository<S1Schema, UUID> {

    List<S1Schema> findByRequestSchema_Id(UUID requestSchemaId);
}
