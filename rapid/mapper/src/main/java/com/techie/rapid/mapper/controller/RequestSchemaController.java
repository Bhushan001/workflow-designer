package com.techie.rapid.mapper.controller;


import com.techie.rapid.constants.MessageConstants;
import com.techie.rapid.dto.RequestSchemaDto;
import com.techie.rapid.mapper.entity.RequestSchema;
import com.techie.rapid.mapper.service.RequestSchemaService;
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
@RequestMapping("/api/request-schemas")
@RequiredArgsConstructor
public class RequestSchemaController {
    private final RequestSchemaService requestSchemaService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<RequestSchemaDto>> createRequestSchema(@RequestParam("name") String name, @RequestParam("description") String description, @RequestPart("schema") MultipartFile schema) throws IOException {
        RequestSchema requestSchema = new RequestSchema();
        requestSchema.setName(name);
        requestSchema.setDescription(description);
        requestSchema.setSchemaData(schema.getBytes()); // Get file content as byte array
        requestSchema.setSchemaFileName(schema.getOriginalFilename());
        RequestSchemaDto savedRequestSchemaDto = requestSchemaService.saveRequestSchema(requestSchema);
        ApiResponse<RequestSchemaDto> response = new ApiResponse<>(HttpStatus.CREATED.value(), MessageConstants.REQUEST_SCHEMA_CREATED_MESSAGE, savedRequestSchemaDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<RequestSchemaDto>>> getAllRequestSchemas(
            Authentication authentication,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {

        Claims claims = (Claims) authentication.getCredentials();
        Page<RequestSchemaDto> requestSchemaDtos = requestSchemaService.getAllRequestSchemas(pageable);

        ApiResponse<Page<RequestSchemaDto>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                HttpStatus.OK.getReasonPhrase(),
                requestSchemaDtos
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dto")
    public ResponseEntity<ApiResponse<List<RequestSchemaDto>>> getAllRequestSchemaDtos() {
        List<RequestSchemaDto> requestSchemaDtos = requestSchemaService.getRequestSchemaDtos();
        ApiResponse<List<RequestSchemaDto>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                HttpStatus.OK.getReasonPhrase(),
                requestSchemaDtos
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RequestSchemaDto>> getRequestSchemaById(@PathVariable UUID id) {
        RequestSchemaDto requestSchemaDto =  requestSchemaService.getRequestSchemaDtoById(id);
        ApiResponse<RequestSchemaDto> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                HttpStatus.OK.getReasonPhrase(),
                requestSchemaDto
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRequestSchema(@PathVariable("id") String id) {
        requestSchemaService.deleteRequestSchema(UUID.fromString(id));
        ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(), MessageConstants.REQUEST_SCHEMA_DELETED_MESSAGE, null);
        return ResponseEntity.ok(response);
    }
}
