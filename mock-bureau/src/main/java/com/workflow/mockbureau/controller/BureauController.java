package com.workflow.mockbureau.controller;

import com.workflow.mockbureau.dto.BureauRequest;
import com.workflow.mockbureau.dto.BureauResponse;
import com.workflow.mockbureau.service.MockBureauService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BureauController {

    private final MockBureauService mockBureauService;

    @PostMapping("/cibil")
    public ResponseEntity<BureauResponse> cibil(@RequestBody(required = false) BureauRequest request) {
        BureauResponse response = mockBureauService.generateMockResponse("CIBIL", request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/crif")
    public ResponseEntity<BureauResponse> crif(@RequestBody(required = false) BureauRequest request) {
        BureauResponse response = mockBureauService.generateMockResponse("CRIF", request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/experian")
    public ResponseEntity<BureauResponse> experian(@RequestBody(required = false) BureauRequest request) {
        BureauResponse response = mockBureauService.generateMockResponse("EXPERIAN", request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/equifix")
    public ResponseEntity<BureauResponse> equifix(@RequestBody(required = false) BureauRequest request) {
        BureauResponse response = mockBureauService.generateMockResponse("EQUIFIX", request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Mock Bureau API",
                "timestamp", java.time.LocalDateTime.now()
        ));
    }
}

