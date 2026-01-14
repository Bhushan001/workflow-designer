package com.techie.rapid.designer.service;

import com.techie.rapid.designer.entity.Page;
import com.techie.rapid.designer.entity.Project;
import com.techie.rapid.designer.repository.PageRepository;
import com.techie.rapid.dto.PageDto;
import com.techie.rapid.exceptions.page.PageNotFoundException;
import com.techie.rapid.exceptions.project.ProjectNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PageService {
    private final PageRepository pageRepository;
    private final UserClientService userClientService;
    private final ProjectService projectService;

    @Autowired
    private ModelMapper modelMapper;

    public PageDto createPage(UUID projectId, Page page) {
        Project project = projectService.getProjectById(projectId).orElseThrow(() -> new ProjectNotFoundException(projectId));
        page.setProject(project);
        Page savedPage = pageRepository.save(page);
        return covertToDto(savedPage);
    }

    public PageDto getPageDtoByProjectIdAndPageId(UUID projectId, UUID pageId) {
        Project project = projectService.getProjectById(projectId).orElseThrow(() -> new ProjectNotFoundException(projectId));
        Page page = pageRepository.findById(pageId).orElseThrow(() -> new ProjectNotFoundException(pageId));
        if (!page.getProject().getId().equals(project.getId())) {
            throw new PageNotFoundException(pageId);
        }
        return covertToDto(page);
    }

    public PageDto getPageDtoById(UUID pageId) {
        Page page = pageRepository.findById(pageId).orElseThrow(() -> new PageNotFoundException(pageId));
        return covertToDto(page);
    }

    public Optional<Page> getPageById(UUID id) {
        return pageRepository.findById(id);
    }

    public org.springframework.data.domain.Page<PageDto> getAllPagesByProjectId(UUID projectId, Pageable pageable) {
        org.springframework.data.domain.Page<Page> pagesPage = pageRepository.findAll(pageable);
        List<PageDto> pageDtos = pagesPage.getContent().stream().map(this::covertToDto).toList();
        return new PageImpl<>(pageDtos, pageable, pagesPage.getTotalElements());
    }

    public PageDto updatePage(UUID pageId, Page pageDetails, UUID projectId) {
        Page page = pageRepository.findById(pageId).orElseThrow(() -> new PageNotFoundException(pageId));
        if (!page.getProject().getId().equals(pageId)) {
            throw new PageNotFoundException(page.getId());
        }
        page.setName(pageDetails.getName());
        page.setDescription(pageDetails.getDescription());
        return covertToDto(pageRepository.save(page));
    }

    public void deletePage(UUID pageId, UUID projectId) {
        Page page = pageRepository.findById(pageId).orElseThrow(() -> new PageNotFoundException(pageId));
        if (!page.getProject().getId().equals(projectId)) {
            throw new PageNotFoundException(page.getId());
        }
        pageRepository.delete(page);
    }

    private PageDto covertToDto(Page page) {
        PageDto dto = modelMapper.map(page, PageDto.class);
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
