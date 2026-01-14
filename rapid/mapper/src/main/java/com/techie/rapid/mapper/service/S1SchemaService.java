package com.techie.rapid.mapper.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.techie.rapid.dto.RequestSchemaDto;
import com.techie.rapid.dto.S1SchemaDto;
import com.techie.rapid.mapper.entity.RequestSchema;
import com.techie.rapid.mapper.entity.S1Schema;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.techie.rapid.mapper.repository.S1SchemaRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.techie.rapid.mapper.util.SchemaDataConverter.convertS1SchemaDataToJson;

@Service
@RequiredArgsConstructor
@Slf4j
public class S1SchemaService {
    private final RequestSchemaService requestSchemaService;
    private final S1SchemaRepository s1SchemaRepository;
    private final UserClientService userClientService;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public S1SchemaDto saveS1Schema(S1Schema s1Schema, UUID requestSchemaId) {
        RequestSchema requestSchema = requestSchemaService.getRequestSchemaById(requestSchemaId);
        s1Schema.setRequestSchema(requestSchema);
        S1Schema savedSchema = s1SchemaRepository.save(s1Schema);
        return convertToDto(savedSchema);
    }

    public Page<S1SchemaDto> getAllS1Schemas(Pageable pageable) {
        Page<S1Schema> s1SchemasPage = s1SchemaRepository.findAll(pageable);
        List<S1SchemaDto> s1SchemaDtos = s1SchemasPage.getContent().stream().map(s1Schema -> {
            S1SchemaDto dto = modelMapper.map(s1Schema, S1SchemaDto.class);
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

        return new PageImpl<>(s1SchemaDtos, pageable, s1SchemasPage.getTotalElements());
    }

    private S1SchemaDto convertToDto(S1Schema s1Schema) {
        if (s1Schema == null) {
            return null; // Or throw an exception
        }
        S1SchemaDto dto = new S1SchemaDto(s1Schema.getId(), s1Schema.getName(), s1Schema.getDescription(), s1Schema.getSchemaFileName(), s1Schema.getCreatedOn(), s1Schema.getCreatedBy(), s1Schema.getUpdatedOn(), s1Schema.getUpdatedBy(), s1Schema.getRequestSchema().getId());

        if (s1Schema.getSchemaData() != null) {
            try {
                JsonNode jsonNode = convertS1SchemaDataToJson(s1Schema);
                if (jsonNode != null) {
                    dto.setSchemaData(jsonNode.toString());
                }
            } catch (Exception e) {
                log.error("Error : {}", s1Schema.getSchemaData(), e);
            }
        }

        if (s1Schema.getCreatedBy() != null) {
            try {
                String createdByName = userClientService.getUserById(dto.getCreatedBy()).getUsername();
                if (createdByName != null) {
                    dto.setCreatedByName(createdByName);
                } else {
                    log.warn("Username not found for createdBy: {}", s1Schema.getCreatedBy());
                }
            } catch (Exception e) {
                log.error("Error fetching createdBy username for id: {}", s1Schema.getCreatedBy(), e);
            }
        }

        if (s1Schema.getUpdatedBy() != null) {
            try {
                String updatedByName = userClientService.getUserById(dto.getUpdatedBy()).getUsername();
                if (updatedByName != null) {
                    dto.setUpdatedByName(updatedByName);
                } else {
                    log.warn("Username not found for updatedBy: {}", s1Schema.getUpdatedBy());
                }
            } catch (Exception e) {
                log.error("Error fetching updatedBy username for id: {}", s1Schema.getUpdatedBy(), e);
            }
        }

        return dto;
    }

    public S1SchemaDto getS1SchemaDtoById(UUID id) {
        S1Schema s1Schema = s1SchemaRepository.findById(id).orElse(null);
        if (s1Schema == null) {
            return null;
        }
        return convertToDto(s1Schema);
    }

    public S1Schema getS1SchemaById(UUID id) {
        return s1SchemaRepository.findById(id).orElse(null);
    }

    public List<S1SchemaDto> getS1SchemasByRequestSchemaId(UUID requestSchemaId) {
        List<S1Schema> s1Schemas = s1SchemaRepository.findByRequestSchema_Id(requestSchemaId);
        return s1Schemas.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Transactional
    public void deleteS1Schema(UUID id) {
        s1SchemaRepository.deleteById(id);
    }

}
