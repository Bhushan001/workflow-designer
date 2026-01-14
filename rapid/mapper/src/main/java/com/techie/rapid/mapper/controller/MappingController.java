package com.techie.rapid.mapper.controller;


import com.techie.rapid.constants.MessageConstants;
import com.techie.rapid.dto.MappingDto;
import com.techie.rapid.dto.S1SchemaDto;
import com.techie.rapid.mapper.entity.Mapping;
import com.techie.rapid.mapper.service.MappingService;
import com.techie.rapid.model.ApiResponse;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/mappings")
@RequiredArgsConstructor
public class MappingController {
    private final MappingService mappingService;

    @PostMapping("/{requestSchemaId}")
    public ResponseEntity<ApiResponse<MappingDto>> saveMapping(
            @RequestBody Mapping mapping,
            @PathVariable UUID requestSchemaId) {
        MappingDto savedMappingDto = mappingService.saveMapping(mapping, requestSchemaId);
        ApiResponse<MappingDto> response = new ApiResponse<>(HttpStatus.CREATED.value(), MessageConstants.MAPPING_CREATED_MESSAGE, savedMappingDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<MappingDto>>> getAllMappings(
            Authentication authentication,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {

        Claims claims = (Claims) authentication.getCredentials();
        Page<MappingDto> mappingDtos = mappingService.getAllMappings(pageable);
        ApiResponse<Page<MappingDto>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                HttpStatus.OK.getReasonPhrase(),
                mappingDtos
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRequestSchema(@PathVariable UUID id) {
        mappingService.deleteMapping(id);
        ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(), MessageConstants.MAPPING_DELETED_MESSAGE, null);
        return ResponseEntity.ok(response);
    }
}
