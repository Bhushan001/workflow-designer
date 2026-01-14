package com.workflow.auth.controller;

import com.workflow.auth.dto.ClientDto;
import com.workflow.auth.entity.Client;
import com.workflow.auth.service.ClientService;
import com.workflow.model.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    /**
     * Create a new client
     * Open endpoint for bootstrap - allows creating the initial PLATFORM client
     * After bootstrap, this should be restricted to PLATFORM_ADMIN only
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ClientDto>> createClient(@RequestBody Client client) {
        ClientDto createdClient = clientService.createClient(client);
        ApiResponse<ClientDto> response = new ApiResponse<>(HttpStatus.CREATED.value(), HttpStatus.CREATED.getReasonPhrase(), createdClient);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all clients
     * PLATFORM_ADMIN can see all clients, CLIENT_ADMIN can see only their client
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'CLIENT_ADMIN')")
    public ResponseEntity<ApiResponse<List<ClientDto>>> getAllClients() {
        // TODO: Filter clients based on user role - CLIENT_ADMIN should only see their own client
        List<ClientDto> clients = clientService.getAllClients();
        ApiResponse<List<ClientDto>> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), clients);
        return ResponseEntity.ok(response);
    }
}
