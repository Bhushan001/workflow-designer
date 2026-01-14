package com.techie.rapid.mapper.controller;


import com.techie.rapid.constants.MessageConstants;
import com.techie.rapid.dto.RequestSchemaDto;
import com.techie.rapid.dto.S1SchemaDto;
import com.techie.rapid.mapper.entity.S1Schema;
import com.techie.rapid.mapper.service.S1SchemaService;
import com.techie.rapid.model.ApiResponse;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/s1-schemas")
@RequiredArgsConstructor
public class S1SchemaController {
    private final S1SchemaService s1SchemaService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<S1SchemaDto>> createS1Schema(@RequestParam("name") String name, @RequestParam("description") String description, @RequestPart("schema") MultipartFile schema, @RequestParam("request_schema_id") UUID requestSchemaId) throws IOException {
        S1Schema s1Schema = new S1Schema();
        s1Schema.setName(name);
        s1Schema.setDescription(description);
        s1Schema.setSchemaData(schema.getBytes()); // Get file content as byte array
        s1Schema.setSchemaFileName(schema.getOriginalFilename());
        S1SchemaDto saveds1SchemaDto = s1SchemaService.saveS1Schema(s1Schema, requestSchemaId);
        ApiResponse<S1SchemaDto> response = new ApiResponse<>(HttpStatus.CREATED.value(), MessageConstants.S1_SCHEMA_CREATED_MESSAGE, saveds1SchemaDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<S1SchemaDto>>> getAllS1Schemas(
            Authentication authentication,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {

        Claims claims = (Claims) authentication.getCredentials();
        Page<S1SchemaDto> s1SchemaDtos = s1SchemaService.getAllS1Schemas(pageable);

        ApiResponse<Page<S1SchemaDto>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                HttpStatus.OK.getReasonPhrase(),
                s1SchemaDtos
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public S1SchemaDto getS1SchemaDtoById(@PathVariable UUID id) {
        return s1SchemaService.getS1SchemaDtoById(id);
    }

    @GetMapping("/requestschema/{requestSchemaId}")
    public ResponseEntity<ApiResponse<List<S1SchemaDto>>> getS1SchemasByRequestSchemaId(@PathVariable UUID requestSchemaId) {
        List<S1SchemaDto> s1SchemaDtos = s1SchemaService.getS1SchemasByRequestSchemaId(requestSchemaId);
        ApiResponse<List<S1SchemaDto>> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.name(), s1SchemaDtos);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRequestSchema(@PathVariable UUID id) {
        s1SchemaService.deleteS1Schema(id);
        ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(), MessageConstants.S1_SCHEMA_DELETED_MESSAGE, null);
        return ResponseEntity.ok(response);
    }
}
