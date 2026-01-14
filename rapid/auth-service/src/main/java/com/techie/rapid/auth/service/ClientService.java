package com.techie.rapid.auth.service;

import com.techie.rapid.auth.dto.ClientDto;
import com.techie.rapid.auth.entity.Client;
import com.techie.rapid.auth.repository.ClientRepository;
import com.techie.rapid.exceptions.GeneralException;
import com.techie.rapid.exceptions.client.ClientAlreadyExistsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    private final UserService userService;
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

    private ClientDto convertToDto(Client client) {
        if (client == null) {
            return null; // Or throw an exception
        }
        ClientDto dto = new ClientDto(
                client.getId(),
                client.getName(),
                client.getDescription(),
                client.getCreatedOn(),
                client.getUpdatedOn(),
                client.getCreatedBy(),
                client.getUpdatedBy()
        );
//        if (client.getCreatedBy() != null) {
//            try {
//                String createdByName = userService.getUserDtoById(client.getCreatedBy()).getUsername();
//                if (createdByName != null) {
//                    dto.setCreatedByName(createdByName);
//                } else {
//                    log.warn("Username not found for createdBy: {}", client.getCreatedBy());
//                }
//            } catch (Exception e) {
//                log.error("Error fetching createdBy username for id: {}", client.getCreatedBy(), e);
//            }
//        }

//        if (client.getUpdatedBy() != null) {
//            try {
//                String updatedByName = userService.getUserDtoById(client.getUpdatedBy()).getUsername();
//                if (updatedByName != null) {
//                    dto.setUpdatedByName(updatedByName);
//                } else {
//                    log.warn("Username not found for updatedBy: {}", client.getUpdatedBy());
//                }
//            } catch (Exception e) {
//                log.error("Error fetching updatedBy username for id: {}", client.getUpdatedBy(), e);
//            }
//        }
        return dto;
    }

    public Optional<Client> getClientById(UUID clientId) {
        return clientRepository.findById(clientId);
    }
}

