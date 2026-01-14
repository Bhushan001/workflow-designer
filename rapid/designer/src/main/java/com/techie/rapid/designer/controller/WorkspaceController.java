package com.techie.rapid.designer.controller;

import com.techie.rapid.constants.MessageConstants;
import com.techie.rapid.designer.entity.Workspace;
import com.techie.rapid.designer.service.WorkspaceService;
import com.techie.rapid.dto.WorkspaceDto;
import com.techie.rapid.model.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @Autowired
    private ModelMapper modelMapper; // Inject ModelMapper

    @PostMapping
    public ResponseEntity<ApiResponse<WorkspaceDto>> createWorkspace(@RequestBody Workspace workspace) {
        WorkspaceDto createdWorkspaceDto = workspaceService.createWorkspace(workspace);
        ApiResponse<WorkspaceDto> response = new ApiResponse<>(HttpStatus.CREATED.value(), MessageConstants.WORKSPACE_CREATED_MESSAGE, createdWorkspaceDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkspaceDto>> getWorkspaceById(@PathVariable UUID id) {
        WorkspaceDto workspaceDto = workspaceService.getWorkspaceDtoById(id);
        ApiResponse<WorkspaceDto> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), workspaceDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<WorkspaceDto>>> getAllWorkspaces(@PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<WorkspaceDto> workspaceDtosPage = workspaceService.getAllWorkspaces(pageable);

        ApiResponse<Page<WorkspaceDto>> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), workspaceDtosPage);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkspaceDto>> updateWorkspace(@PathVariable UUID id, @RequestBody Workspace workspace) {
        WorkspaceDto updatedWorkspaceDto = workspaceService.updateWorkspace(id, workspace);
        ApiResponse<WorkspaceDto> response = new ApiResponse<>(HttpStatus.OK.value(), MessageConstants.WORKSPACE_UPDATED_MESSAGE, updatedWorkspaceDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteWorkspace(@PathVariable UUID id) {
        workspaceService.deleteWorkspace(id);
        ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(), // or HttpStatus.ACCEPTED.value()
                HttpStatus.OK.getReasonPhrase(), // or HttpStatus.ACCEPTED.getReasonPhrase()
                MessageConstants.WORKSPACE_DELETED_MESSAGE);
        return ResponseEntity.ok(response); // or ResponseEntity.accepted(response).build();
    }
}