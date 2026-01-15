package com.workflow.auth.service;

import com.workflow.auth.dto.ClientDto;
import com.workflow.auth.dto.PlatformSettingsDto;
import com.workflow.auth.entity.Client;
import com.workflow.auth.repository.ClientRepository;
import com.workflow.exceptions.GeneralException;
import com.workflow.exceptions.client.ClientAlreadyExistsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClientService {

    private final ClientRepository clientRepository;
    private final PlatformSettingsService platformSettingsService;

    public ClientDto createClient(Client client) {
        try {
            // Apply default quotas from platform settings if not provided
            applyDefaultQuotas(client);
            
            Client savedClient = clientRepository.save(client);
            return convertToDto(savedClient);
        } catch (DataIntegrityViolationException e) {
            throw new ClientAlreadyExistsException(client.getName());
        } catch (Exception e) {
           throw new GeneralException();
        }
    }

    /**
     * Applies default quotas from platform settings to the client if not already set
     */
    private void applyDefaultQuotas(Client client) {
        try {
            PlatformSettingsDto settings = platformSettingsService.getSettings();
            
            // Apply default max users if not set
            if (client.getMaxUsers() == null && settings.getDefaultMaxUsersPerClient() != null) {
                client.setMaxUsers(settings.getDefaultMaxUsersPerClient());
                log.debug("Applied default max users: {} to client: {}", 
                    settings.getDefaultMaxUsersPerClient(), client.getName());
            }
            
            // Apply default max workflows if not set
            if (client.getMaxWorkflows() == null && settings.getDefaultMaxWorkflowsPerClient() != null) {
                client.setMaxWorkflows(settings.getDefaultMaxWorkflowsPerClient());
                log.debug("Applied default max workflows: {} to client: {}", 
                    settings.getDefaultMaxWorkflowsPerClient(), client.getName());
            }
            
            // Note: Storage quota is handled separately if needed in the future
        } catch (Exception e) {
            log.warn("Could not apply default quotas to client, proceeding without defaults", e);
            // Don't throw exception, just log warning and proceed
        }
    }

    public List<ClientDto> getAllClients() {
        List<Client> clients = clientRepository.findAll();
        if (clients.isEmpty()) {
            return List.of();
        }
        return clients.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Page<ClientDto> getAllClientsWithPagination(Pageable pageable, String search) {
        Page<Client> clientsPage;
        
        if (search != null && !search.trim().isEmpty()) {
            clientsPage = clientRepository.findAllWithSearch(search.trim(), pageable);
        } else {
            clientsPage = clientRepository.findAll(pageable);
        }
        
        List<ClientDto> clientDtos = clientsPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return new PageImpl<>(clientDtos, pageable, clientsPage.getTotalElements());
    }

    public ClientDto convertToDto(Client client) {
        if (client == null) {
            return null;
        }
        ClientDto dto = new ClientDto(
                client.getId(),
                client.getClientCode(),
                client.getName(),
                client.getDescription(),
                client.getContactEmail(),
                client.getContactPhone(),
                client.getContactPersonName(),
                client.getWebsiteUrl(),
                client.getIndustry(),
                client.getCompanySize(),
                client.getStatus(),
                client.getTimeZone(),
                client.getLocale(),
                client.getMaxUsers(),
                client.getMaxWorkflows(),
                client.getBillingContactEmail(),
                client.getInternalNotes(),
                client.getCreatedOn(),
                client.getUpdatedOn(),
                client.getCreatedBy(),
                client.getUpdatedBy()
        );
        return dto;
    }

    public Optional<Client> getClientById(UUID clientId) {
        return clientRepository.findById(clientId);
    }

    public ClientDto updateClient(UUID clientId, Client client) {
        Optional<Client> existingClientOpt = clientRepository.findById(clientId);
        if (existingClientOpt.isEmpty()) {
            throw new com.workflow.exceptions.client.ClientNotFoundException(clientId);
        }
        
        Client existingClient = existingClientOpt.get();
        
        // Update fields from the provided client
        if (client.getName() != null) {
            existingClient.setName(client.getName());
        }
        if (client.getClientCode() != null) {
            existingClient.setClientCode(client.getClientCode());
        }
        if (client.getDescription() != null) {
            existingClient.setDescription(client.getDescription());
        }
        if (client.getContactEmail() != null) {
            existingClient.setContactEmail(client.getContactEmail());
        }
        if (client.getContactPhone() != null) {
            existingClient.setContactPhone(client.getContactPhone());
        }
        if (client.getContactPersonName() != null) {
            existingClient.setContactPersonName(client.getContactPersonName());
        }
        if (client.getWebsiteUrl() != null) {
            existingClient.setWebsiteUrl(client.getWebsiteUrl());
        }
        if (client.getIndustry() != null) {
            existingClient.setIndustry(client.getIndustry());
        }
        if (client.getCompanySize() != null) {
            existingClient.setCompanySize(client.getCompanySize());
        }
        if (client.getStatus() != null) {
            existingClient.setStatus(client.getStatus());
        }
        if (client.getTimeZone() != null) {
            existingClient.setTimeZone(client.getTimeZone());
        }
        if (client.getLocale() != null) {
            existingClient.setLocale(client.getLocale());
        }
        if (client.getMaxUsers() != null) {
            existingClient.setMaxUsers(client.getMaxUsers());
        }
        if (client.getMaxWorkflows() != null) {
            existingClient.setMaxWorkflows(client.getMaxWorkflows());
        }
        if (client.getBillingContactEmail() != null) {
            existingClient.setBillingContactEmail(client.getBillingContactEmail());
        }
        if (client.getInternalNotes() != null) {
            existingClient.setInternalNotes(client.getInternalNotes());
        }
        
        try {
            Client savedClient = clientRepository.save(existingClient);
            return convertToDto(savedClient);
        } catch (DataIntegrityViolationException e) {
            throw new ClientAlreadyExistsException(client.getName());
        } catch (Exception e) {
            throw new GeneralException();
        }
    }

    public void deleteClient(UUID clientId) {
        Optional<Client> clientOpt = clientRepository.findById(clientId);
        if (clientOpt.isEmpty()) {
            throw new com.workflow.exceptions.client.ClientNotFoundException(clientId);
        }
        
        clientRepository.deleteById(clientId);
        log.info("Client deleted with ID: {}", clientId);
    }
}
