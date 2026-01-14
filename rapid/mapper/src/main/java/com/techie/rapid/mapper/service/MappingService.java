package com.techie.rapid.mapper.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.techie.rapid.dto.MappingDto;
import com.techie.rapid.dto.S1SchemaDto;
import com.techie.rapid.mapper.entity.Mapping;
import com.techie.rapid.mapper.entity.RequestSchema;
import com.techie.rapid.mapper.entity.S1Schema;
import com.techie.rapid.mapper.repository.MappingRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.FlushModeType;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.techie.rapid.mapper.util.SchemaDataConverter.convertMappingDataToJson;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MappingService {
    private final MappingRepository mappingRepository;
    private final RequestSchemaService requestSchemaService;
    private final UserClientService userClientService;
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public MappingDto saveMapping(Mapping mapping, UUID requestSchemaId) {
        RequestSchema requestSchema = requestSchemaService.getRequestSchemaById(requestSchemaId);
        mapping.setRequestSchema(requestSchema);
        Mapping savedMapping = mappingRepository.save(mapping);
        return convertToDto(savedMapping);
    }

    private MappingDto convertToDto(Mapping mapping) {
        if (mapping == null) {
            return null; // Or throw an exception
        }
        MappingDto dto = new MappingDto(
                mapping.getId(),
                mapping.getName(),
                mapping.getDescription(),
                mapping.getSchemaFileName(),
                mapping.getCreatedOn(),
                mapping.getCreatedBy(),
                mapping.getUpdatedOn(),
                mapping.getUpdatedBy(),
                mapping.getRequestSchema().getId()
        );
        if (mapping.getSchemaData() != null) {
            try {
                JsonNode jsonNode = convertMappingDataToJson(mapping);
                if (jsonNode != null) {
                    dto.setSchemaData(jsonNode.toString());
                }
            } catch (Exception e) {
                log.error("Error : {}", mapping.getSchemaData(), e);
            }
        }
        if (mapping.getCreatedBy() != null) {
            try {
                String createdByName = userClientService.getUserById(dto.getCreatedBy()).getUsername();
                if (createdByName != null) {
                    dto.setCreatedByName(createdByName);
                } else {
                    log.warn("Username not found for createdBy: {}", mapping.getCreatedBy());
                }
            } catch (Exception e) {
                log.error("Error fetching createdBy username for id: {}", mapping.getCreatedBy(), e);
            }
        }
        if (mapping.getUpdatedBy() != null) {
            try {
                String updatedByName = userClientService.getUserById(dto.getUpdatedBy()).getUsername();
                if (updatedByName != null) {
                    dto.setUpdatedByName(updatedByName);
                } else {
                    log.warn("Username not found for updatedBy: {}", mapping.getUpdatedBy());
                }
            } catch (Exception e) {
                log.error("Error fetching updatedBy username for id: {}", mapping.getUpdatedBy(), e);
            }
        }
        return dto;
    }

    public Page<MappingDto> getAllMappings(Pageable pageable) {
        Page<Mapping> mappingsPage = mappingRepository.findAll(pageable);
        List<MappingDto> mappingDtos = mappingsPage.getContent().stream().map(mapping -> {
            MappingDto dto = modelMapper.map(mapping, MappingDto.class);
            String createdByName = userClientService.getUserById(dto.getCreatedBy()).getUsername();
            String updatedByName = userClientService.getUserById(dto.getUpdatedBy()).getUsername();
            if (createdByName != null) {
                dto.setCreatedByName(createdByName);
            } else {
                log.warn("Username not found for createdBy: {}", dto.getCreatedBy());
            }
            if (updatedByName != null) {
                dto.setUpdatedByName(updatedByName);
            } else {
                log.warn("Username not found for updatedBy: {}", dto.getUpdatedBy());
            }
            return dto;
        }).collect(Collectors.toList());
        return new PageImpl<>(mappingDtos, pageable, mappingsPage.getTotalElements());
    }

    @Transactional
    public void deleteMapping(UUID id) {
        Optional<Mapping> optionalMapping = mappingRepository.findById(id);
        if (optionalMapping.isPresent()) {
            Mapping mapping = optionalMapping.get();
            mapping.setRequestSchema(null); // Break the relationship
            mappingRepository.save(mapping);
            entityManager.unwrap(Session.class).setFlushMode(FlushModeType.COMMIT);
            entityManager.flush(); // Flush the persistence context
            mappingRepository.deleteById(id);
        }
    }
}
