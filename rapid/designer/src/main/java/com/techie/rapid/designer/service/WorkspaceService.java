package com.techie.rapid.designer.service;

import com.techie.rapid.designer.entity.Workspace;
import com.techie.rapid.designer.repository.PageRepository;
import com.techie.rapid.designer.repository.ProjectRepository;
import com.techie.rapid.designer.repository.WorkspaceRepository;
import com.techie.rapid.dto.WorkspaceDto;
import com.techie.rapid.exceptions.workspace.WorkspaceAlreadyExistsException;
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
public class WorkspaceService {

    private final ProjectRepository projectRepository;

    private final PageRepository pageRepository;

    private final WorkspaceRepository workspaceRepository;

    @Autowired
    private ModelMapper modelMapper;

    private final UserClientService userClientService;


    public WorkspaceDto createWorkspace(Workspace workspace) {
        Optional<Workspace> existingWorkspace = workspaceRepository.findByName(workspace.getName());
        if (existingWorkspace.isPresent()) {
            throw new WorkspaceAlreadyExistsException(workspace.getName());
        }
        Workspace savedWorkspace = workspaceRepository.save(workspace);
        return covertToDto(savedWorkspace);
    }

    public WorkspaceDto getWorkspaceDtoById(UUID id) {
        Workspace workspace = workspaceRepository.findById(id).orElseThrow(() -> new WorkspaceNotFoundException(id));
        return covertToDto(workspace);
    }

    public Optional<Workspace> getWorkspaceById(UUID id) {
        return workspaceRepository.findById(id);
    }

    public Page<WorkspaceDto> getAllWorkspaces(Pageable pageable) {
        Page<Workspace> workspacesPage = workspaceRepository.findAll(pageable);
        List<WorkspaceDto> workspaceDtos = workspacesPage.getContent().stream().map(this::covertToDto).toList();
        return new PageImpl<>(workspaceDtos, pageable, workspacesPage.getTotalElements());
    }

    public WorkspaceDto updateWorkspace(UUID workspaceId, Workspace workspace) {
        Workspace savedWorkspace = workspaceRepository.findById(workspaceId).orElseThrow(() -> new WorkspaceNotFoundException(workspace.getName()));
        savedWorkspace.setName(workspace.getName());
        savedWorkspace.setDescription(workspace.getDescription());
        return covertToDto(workspaceRepository.save(savedWorkspace));
    }

    public void deleteWorkspace(UUID id) {
    }

    private WorkspaceDto covertToDto(Workspace workspace) {
        WorkspaceDto dto = modelMapper.map(workspace, WorkspaceDto.class);
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
