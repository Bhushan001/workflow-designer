package com.workflow.mockbureau.service;

import com.workflow.mockbureau.dto.BureauRequest;
import com.workflow.mockbureau.dto.BureauResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class MockBureauService {

    public BureauResponse generateMockResponse(String bureau, BureauRequest request) {
        String requestId = UUID.randomUUID().toString();
        
        // Generate bureau-specific mock data
        Map<String, Object> mockData = generateBureauSpecificData(bureau, request);
        
        return BureauResponse.builder()
                .success(true)
                .bureau(bureau)
                .message("Mock response from " + bureau + " bureau")
                .data(mockData)
                .timestamp(LocalDateTime.now())
                .requestId(requestId)
                .build();
    }

    private Map<String, Object> generateBureauSpecificData(String bureau, BureauRequest request) {
        Map<String, Object> data = new HashMap<>();
        
        // Common fields
        data.put("bureau", bureau);
        data.put("requestReceived", true);
        data.put("processedAt", LocalDateTime.now().toString());
        
        // Bureau-specific mock data
        switch (bureau.toUpperCase()) {
            case "CIBIL":
                data.put("creditScore", 750 + (int)(Math.random() * 100));
                data.put("reportNumber", "CIBIL-" + System.currentTimeMillis());
                data.put("status", "ACTIVE");
                data.put("accounts", generateMockAccounts(5));
                data.put("enquiries", (int)(Math.random() * 10));
                break;
                
            case "CRIF":
                data.put("creditScore", 680 + (int)(Math.random() * 120));
                data.put("reportNumber", "CRIF-" + System.currentTimeMillis());
                data.put("status", "ACTIVE");
                data.put("accounts", generateMockAccounts(7));
                data.put("enquiries", (int)(Math.random() * 8));
                data.put("crifScore", 650 + (int)(Math.random() * 150));
                break;
                
            case "EXPERIAN":
                data.put("creditScore", 720 + (int)(Math.random() * 80));
                data.put("reportNumber", "EXP-" + System.currentTimeMillis());
                data.put("status", "ACTIVE");
                data.put("accounts", generateMockAccounts(6));
                data.put("enquiries", (int)(Math.random() * 12));
                data.put("experianScore", 700 + (int)(Math.random() * 100));
                break;
                
            case "EQUIFIX":
                data.put("creditScore", 690 + (int)(Math.random() * 110));
                data.put("reportNumber", "EQF-" + System.currentTimeMillis());
                data.put("status", "ACTIVE");
                data.put("accounts", generateMockAccounts(4));
                data.put("enquiries", (int)(Math.random() * 9));
                data.put("equifaxScore", 680 + (int)(Math.random() * 120));
                break;
                
            default:
                data.put("creditScore", 700);
                data.put("reportNumber", "UNKNOWN-" + System.currentTimeMillis());
        }
        
        // Include request data if provided
        if (request != null && request.getData() != null && !request.getData().isEmpty()) {
            data.put("requestData", request.getData());
        }
        
        return data;
    }

    private Object generateMockAccounts(int count) {
        Map<String, Object> accounts = new HashMap<>();
        for (int i = 1; i <= count; i++) {
            Map<String, Object> account = new HashMap<>();
            account.put("accountNumber", "ACC" + String.format("%04d", i));
            account.put("type", i % 2 == 0 ? "CREDIT_CARD" : "LOAN");
            account.put("status", i % 3 == 0 ? "CLOSED" : "ACTIVE");
            account.put("balance", Math.random() * 100000);
            account.put("limit", 50000 + (int)(Math.random() * 200000));
            accounts.put("account" + i, account);
        }
        return accounts;
    }
}

