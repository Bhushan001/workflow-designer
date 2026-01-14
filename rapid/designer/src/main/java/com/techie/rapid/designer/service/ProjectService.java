package com.techie.rapid.designer.service;


import com.techie.rapid.designer.entity.Project;
import com.techie.rapid.designer.entity.Workspace;
import com.techie.rapid.designer.repository.ProjectRepository;
import com.techie.rapid.dto.ProjectDto;
import com.techie.rapid.dto.WorkspaceDto;
import com.techie.rapid.exceptions.project.ProjectNotFoundException;
import com.techie.rapid.exceptions.workspace.WorkspaceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final WorkspaceService workspaceService;
    private final UserClientService userClientService;

    @Autowired
    private ModelMapper modelMapper;

    public ProjectDto createProject(Project project, UUID workspaceId) {
        Workspace workspace = workspaceService.getWorkspaceById(workspaceId).orElseThrow(() -> new WorkspaceNotFoundException(workspaceId));
        project.setWorkspace(workspace);
        Project savedProject = projectRepository.save(project);
        return covertToDto(savedProject);
    }

    public ProjectDto getProjectDtoByProjectIdAndWorkspaceId(UUID workspaceId, UUID projectId) {
        Workspace workspace = workspaceService.getWorkspaceById(workspaceId).orElseThrow(() -> new WorkspaceNotFoundException(workspaceId));
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException(projectId));
        if (!project.getWorkspace().getId().equals(workspace.getId())) {
            throw new ProjectNotFoundException(projectId);
        }
        return covertToDto(project);
    }

    public ProjectDto getProjectDtoById(UUID projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException(projectId));
        return covertToDto(project);
    }

    public Optional<Project> getProjectById(UUID id) {
        return projectRepository.findById(id);
    }

    public Page<ProjectDto> getAllProjectsByWorkspace(UUID workspaceId, Pageable pageable) {
        Page<Project> projectsPage = projectRepository.findAll(pageable);
        List<ProjectDto> projectDtos = projectsPage.getContent().stream().map(this::covertToDto).toList();
        return new PageImpl<>(projectDtos, pageable, projectsPage.getTotalElements());
    }

    public ProjectDto updateProject(UUID projectId, Project projectDetails, UUID workspaceId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException(projectId));
        if (!project.getWorkspace().getId().equals(workspaceId)) {
            throw new ProjectNotFoundException(project.getId());
        }
        project.setName(projectDetails.getName());
        project.setDescription(projectDetails.getDescription());
        return covertToDto(projectRepository.save(project));
    }

    public void deleteProject(UUID projectId, UUID workspaceId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException(projectId));
        if (!project.getWorkspace().getId().equals(workspaceId)) {
            throw new ProjectNotFoundException(project.getId());
        }
        projectRepository.delete(project);
    }

    private ProjectDto covertToDto(Project project) {
        ProjectDto dto = modelMapper.map(project, ProjectDto.class);
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
    }
}
