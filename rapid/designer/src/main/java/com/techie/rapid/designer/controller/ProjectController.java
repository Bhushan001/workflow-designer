package com.techie.rapid.designer.controller;

import com.techie.rapid.constants.MessageConstants;
import com.techie.rapid.designer.entity.Project;
import com.techie.rapid.designer.service.ProjectService;
import com.techie.rapid.dto.ProjectDto;
import com.techie.rapid.dto.WorkspaceDto;
import com.techie.rapid.model.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(@PathVariable UUID workspaceId, @RequestBody Project project) {
        ProjectDto createdProjectDto = projectService.createProject(project, workspaceId);
        ApiResponse<ProjectDto> response = new ApiResponse<>(HttpStatus.CREATED.value(), MessageConstants.PROJECT_CREATED_MESSAGE, createdProjectDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ApiResponse<ProjectDto>> getProjectById(@PathVariable UUID workspaceId, @PathVariable UUID projectId) {
        ProjectDto projectDto = projectService.getProjectDtoByProjectIdAndWorkspaceId(workspaceId, projectId);
        ApiResponse<ProjectDto> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), projectDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProjectDto>>> getAllProjects(@PathVariable UUID workspaceId, @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<ProjectDto> projectDtosPage = projectService.getAllProjectsByWorkspace(workspaceId, pageable);
        ApiResponse<Page<ProjectDto>> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), projectDtosPage);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(@PathVariable UUID workspaceId, @PathVariable UUID projectId, @RequestBody Project projectDetails) {
        ProjectDto updatedProjectDto = projectService.updateProject(projectId, projectDetails, workspaceId);
        ApiResponse<ProjectDto> response = new ApiResponse<>(HttpStatus.OK.value(), MessageConstants.PROJECT_UPDATED_MESSAGE, updatedProjectDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<ApiResponse<String>> deleteProject(@PathVariable UUID workspaceId, @PathVariable UUID projectId) {
        projectService.deleteProject(projectId, workspaceId);
        ApiResponse<String> response = new ApiResponse<>(HttpStatus.OK.value(), // or HttpStatus.ACCEPTED.value()
                HttpStatus.OK.getReasonPhrase(), // or HttpStatus.ACCEPTED.getReasonPhrase()
                MessageConstants.PROJECT_DELETED_MESSAGE);
        return ResponseEntity.ok(response);
    }
}
