package com.workflow.auth.controller;

import com.workflow.auth.dto.ClientDto;
import com.workflow.auth.entity.Client;
import com.workflow.auth.entity.User;
import com.workflow.auth.service.ClientService;
import com.workflow.auth.service.UserService;
import com.workflow.model.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;
    private final UserService userService;

    /**
     * Create a new client
     * Restricted to PLATFORM_ADMIN only
     */
    @PostMapping
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
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

    /**
     * Get all clients with pagination
     * PLATFORM_ADMIN can see all clients, CLIENT_ADMIN can see only their client
     */
    @GetMapping("/paginated")
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'CLIENT_ADMIN')")
    public ResponseEntity<ApiResponse<Page<ClientDto>>> getAllClientsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        // TODO: Filter clients based on user role - CLIENT_ADMIN should only see their own client
        Pageable pageable = PageRequest.of(page, size);
        Page<ClientDto> clientsPage = clientService.getAllClientsWithPagination(pageable, search);
        ApiResponse<Page<ClientDto>> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), clientsPage);
        return ResponseEntity.ok(response);
    }

    /**
     * Get a single client by ID
     * PLATFORM_ADMIN can access any client
     * CLIENT_ADMIN and CLIENT_USER can only access their own client
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'CLIENT_ADMIN', 'CLIENT_USER')")
    public ResponseEntity<ApiResponse<ClientDto>> getClientById(@PathVariable java.util.UUID id) {
        // Check if user is PLATFORM_ADMIN
        org.springframework.security.core.Authentication authentication = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        
        boolean isPlatformAdmin = authentication.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("PLATFORM_ADMIN"));
        
        // If not PLATFORM_ADMIN, verify the user is accessing their own client
        if (!isPlatformAdmin) {
            Optional<User> currentUserOpt = userService.getCurrentUser();
            if (currentUserOpt.isEmpty()) {
                throw new AccessDeniedException("Access Denied: Unable to retrieve user information");
            }
            
            User currentUser = currentUserOpt.get();
            if (currentUser.getClient() == null) {
                throw new AccessDeniedException("Access Denied: User does not have a client assigned");
            }
            
            UUID userClientId = currentUser.getClient().getId();
            if (!userClientId.equals(id)) {
                throw new AccessDeniedException("Access Denied: You can only access your own client");
            }
        }
        
        return clientService.getClientById(id)
                .map(client -> {
                    ClientDto dto = clientService.convertToDto(client);
                    ApiResponse<ClientDto> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), dto);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update a client
     * PLATFORM_ADMIN can update any client
     * CLIENT_ADMIN can only update their own client (limited fields)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('PLATFORM_ADMIN', 'CLIENT_ADMIN')")
    public ResponseEntity<ApiResponse<ClientDto>> updateClient(@PathVariable java.util.UUID id, @RequestBody Client client) {
        try {
            // Check if user is PLATFORM_ADMIN
            org.springframework.security.core.Authentication authentication = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            
            boolean isPlatformAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("PLATFORM_ADMIN"));
            
            // If not PLATFORM_ADMIN, verify the user is updating their own client
            if (!isPlatformAdmin) {
                Optional<User> currentUserOpt = userService.getCurrentUser();
                if (currentUserOpt.isEmpty() || currentUserOpt.get().getClient() == null) {
                    throw new AccessDeniedException("Access Denied: User does not have a client assigned");
                }
                
                UUID userClientId = currentUserOpt.get().getClient().getId();
                if (!userClientId.equals(id)) {
                    throw new AccessDeniedException("Access Denied: You can only update your own client");
                }
                
                // CLIENT_ADMIN cannot change certain fields: clientCode, status, maxUsers, maxWorkflows, internalNotes
                // These restrictions should be handled in the service layer
                // For now, we'll allow all updates but restrict in service if needed
            }
            
            ClientDto updatedClient = clientService.updateClient(id, client);
            ApiResponse<ClientDto> response = new ApiResponse<>(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), updatedClient);
            return ResponseEntity.ok(response);
        } catch (org.springframework.security.access.AccessDeniedException e) {
            throw e; // Re-throw access denied exceptions
        } catch (com.workflow.exceptions.client.ClientNotFoundException e) {
            ApiResponse<ClientDto> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            ApiResponse<ClientDto> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error updating client: " + e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Delete a client
     * Restricted to PLATFORM_ADMIN only
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteClient(@PathVariable java.util.UUID id) {
        try {
            clientService.deleteClient(id);
            ApiResponse<Void> response = new ApiResponse<>(HttpStatus.OK.value(), "Client deleted successfully", null);
            return ResponseEntity.ok(response);
        } catch (com.workflow.exceptions.client.ClientNotFoundException e) {
            ApiResponse<Void> response = new ApiResponse<>(HttpStatus.NOT_FOUND.value(), e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            ApiResponse<Void> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error deleting client: " + e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
