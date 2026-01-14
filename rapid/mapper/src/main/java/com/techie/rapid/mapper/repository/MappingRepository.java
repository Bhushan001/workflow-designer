package com.techie.rapid.mapper.repository;

import com.techie.rapid.mapper.entity.Mapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MappingRepository extends JpaRepository<Mapping, UUID> {
}
