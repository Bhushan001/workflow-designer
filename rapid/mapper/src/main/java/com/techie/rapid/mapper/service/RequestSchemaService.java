package com.techie.rapid.mapper.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.techie.rapid.dto.RequestSchemaDto;
import com.techie.rapid.mapper.entity.RequestSchema;
import com.techie.rapid.mapper.repository.RequestSchemaRepository;
import io.jsonwebtoken.Claims;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.techie.rapid.mapper.util.SchemaDataConverter.convertSchemaDataToJson;

@Service
@RequiredArgsConstructor
@Slf4j
public class RequestSchemaService {
    private final RequestSchemaRepository requestSchemaRepository;
    private final UserClientService userClientService;
    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public RequestSchemaDto saveRequestSchema(RequestSchema requestSchema) {
        RequestSchema savedSchema = requestSchemaRepository.save(requestSchema);
        return convertToDto(savedSchema);
    }

    public Page<RequestSchemaDto> getAllRequestSchemas(Pageable pageable) {
        Page<RequestSchema> requestSchemasPage = requestSchemaRepository.findAll(pageable);

        List<RequestSchemaDto> requestSchemaDtos = requestSchemasPage.getContent().stream()
                .map(requestSchema -> {
                    RequestSchemaDto dto = modelMapper.map(requestSchema, RequestSchemaDto.class);
                    String createdByName = userClientService.getUserById(dto.getCreatedBy()).getUsername();
                    String updatedByName = userClientService.getUserById(dto.getUpdatedBy()).getUsername();
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

                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(requestSchemaDtos, pageable, requestSchemasPage.getTotalElements());
    }

    private RequestSchemaDto convertToDto(RequestSchema requestSchema) {
        if (requestSchema == null) {
            return null; // Or throw an exception
        }
        RequestSchemaDto dto = new RequestSchemaDto(requestSchema.getId(), requestSchema.getName(), requestSchema.getDescription(), requestSchema.getSchemaFileName(), requestSchema.getCreatedOn(), requestSchema.getCreatedBy(), requestSchema.getUpdatedOn(), requestSchema.getUpdatedBy());

        if (requestSchema.getSchemaData() != null) {
            try {
                JsonNode jsonNode = convertSchemaDataToJson(requestSchema);
                if (jsonNode != null) {
                    dto.setSchemaData(jsonNode.toString());
                }
            } catch (Exception e) {
                log.error("Error : {}", requestSchema.getSchemaData(), e);
            }
        }

        if (requestSchema.getCreatedBy() != null) {
            try {
                String createdByName = userClientService.getUserById(dto.getCreatedBy()).getUsername();
                if (createdByName != null) {
                    dto.setCreatedByName(createdByName);
                } else {
                    log.warn("Username not found for createdBy: {}", requestSchema.getCreatedBy());
                }
            } catch (Exception e) {
                log.error("Error fetching createdBy username for id: {}", requestSchema.getCreatedBy(), e);
            }
        }

        if (requestSchema.getUpdatedBy() != null) {
            try {
                String updatedByName = userClientService.getUserById(dto.getUpdatedBy()).getUsername();
                if (updatedByName != null) {
                    dto.setUpdatedByName(updatedByName);
                } else {
                    log.warn("Username not found for updatedBy: {}", requestSchema.getUpdatedBy());
                }
            } catch (Exception e) {
                log.error("Error fetching updatedBy username for id: {}", requestSchema.getUpdatedBy(), e);
            }
        }

        return dto;
    }

    public RequestSchemaDto getRequestSchemaDtoById(UUID id) {
        RequestSchema requestSchema = requestSchemaRepository.findById(id).orElse(null);
        if (requestSchema == null) {
            return null;
        }
        return convertToDto(requestSchema);
    }

    public List<RequestSchemaDto> getRequestSchemaDtos() {
        List<RequestSchema> requestSchemas = requestSchemaRepository.findAll();
        return requestSchemas.stream()
                .map(requestSchema -> {
                    RequestSchemaDto dto = modelMapper.map(requestSchema, RequestSchemaDto.class);
                    String createdByName = userClientService.getUserById(dto.getCreatedBy()).getUsername();
                    String updatedByName = userClientService.getUserById(dto.getUpdatedBy()).getUsername();
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

                    return dto;
                })
                .collect(Collectors.toList());
    }

    public RequestSchema getRequestSchemaById(UUID id) {
        RequestSchema requestSchema = requestSchemaRepository.findById(id).orElse(null);
        if (requestSchema == null) {
            return null;
        }
        return requestSchema;
    }

    @Transactional
    public void deleteRequestSchema(UUID id) {
        requestSchemaRepository.deleteById(id);
    }
}
