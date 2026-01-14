package com.techie.rapid.auth.controller;

import com.techie.rapid.auth.dto.ClientDto;
import com.techie.rapid.auth.entity.Client;
import com.techie.rapid.auth.service.ClientService;
import com.techie.rapid.constants.MessageConstants;
import com.techie.rapid.model.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;
    @PostMapping
    public ResponseEntity<ApiResponse<ClientDto>> createClient(@RequestBody Client client) {
        ClientDto clientDto = clientService.createClient(client);
        ApiResponse<ClientDto> response = new ApiResponse<>(201, MessageConstants.CLIENT_CREATION_MESSAGE, clientDto);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClientDto>>> getAllClients() {
        List<ClientDto> clientDtos = clientService.getAllClients();
        ApiResponse<List<ClientDto>> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                HttpStatus.OK.getReasonPhrase(),
                clientDtos
        );
        return ResponseEntity.ok(response);
    }
}
