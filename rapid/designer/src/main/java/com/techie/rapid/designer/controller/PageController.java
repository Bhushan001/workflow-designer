package com.techie.rapid.designer.controller;


import com.techie.rapid.constants.MessageConstants;
import com.techie.rapid.designer.entity.Page;
import com.techie.rapid.designer.entity.Project;
import com.techie.rapid.designer.service.PageService;
import com.techie.rapid.dto.PageDto;
import com.techie.rapid.model.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/pages")
@RequiredArgsConstructor
public class PageController {
    private final PageService pageService;
    @PostMapping
    public ResponseEntity<ApiResponse<PageDto>> createPage(@PathVariable UUID projectId, @RequestBody Page page) {
        PageDto createdPageDto = pageService.createPage(projectId, page);
        ApiResponse<PageDto> response = new ApiResponse<>(HttpStatus.CREATED.value(), MessageConstants.PAGE_CREATED_MESSAGE, createdPageDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{pageId}")
    public ResponseEntity<ApiResponse<PageDto>> getPageById(@PathVariable UUID projectId, @PathVariable UUID pageId) {
        PageDto pageDto = pageService.getPageDtoByProjectIdAndPageId(projectId,pageId);
        ApiResponse<PageDto> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), pageDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<PageDto>>> getAllPages(@PathVariable UUID projectId, @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        org.springframework.data.domain.Page<PageDto> pageDtosPage = pageService.getAllPagesByProjectId(projectId, pageable);
        ApiResponse<org.springframework.data.domain.Page<PageDto>> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), pageDtosPage);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{pageId}")
    public ResponseEntity<ApiResponse<PageDto>> updateProject(@PathVariable UUID projectId, @PathVariable UUID pageId, @RequestBody Page pageDetails) {
        PageDto updatedPageDto = pageService.updatePage(pageId, pageDetails, projectId);
        ApiResponse<PageDto> response = new ApiResponse<>(HttpStatus.OK.value(), MessageConstants.PAGE_UPDATED_MESSAGE, updatedPageDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{pageId}")
    public ResponseEntity<ApiResponse<String>> deletePage(@PathVariable UUID workspaceId, @PathVariable UUID projectId) {
        pageService.deletePage(projectId, workspaceId);
        ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(), // or HttpStatus.ACCEPTED.value()
                HttpStatus.OK.getReasonPhrase(), // or HttpStatus.ACCEPTED.getReasonPhrase()
                MessageConstants.PAGE_DELETED_MESSAGE);
        return ResponseEntity.ok(response);
    }
}
