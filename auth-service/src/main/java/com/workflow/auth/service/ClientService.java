package com.workflow.auth.service;

import com.workflow.auth.dto.ClientDto;
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

    public ClientDto createClient(Client client) {
        try {
            Client savedClient = clientRepository.save(client);
            return convertToDto(savedClient);
        } catch (DataIntegrityViolationException e) {
            throw new ClientAlreadyExistsException(client.getName());
        } catch (Exception e) {
           throw new GeneralException();
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

    private ClientDto convertToDto(Client client) {
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
}
