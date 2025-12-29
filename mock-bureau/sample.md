# Mock Bureau API - Request Body Samples

This document provides sample request bodies for all POST endpoints in the Mock Bureau API service.

## Base URL

```
http://localhost:8081/mock-bureau/api
```

---

## 1. CIBIL API

**Endpoint:** `POST /api/cibil`

### Sample Request 1: Basic PAN and Name
```json
{
  "pan": "ABCDE1234F",
  "name": "John Doe"
}
```

### Sample Request 2: With Date of Birth
```json
{
  "pan": "ABCDE1234F",
  "name": "John Doe",
  "dob": "1990-01-01"
}
```

### Sample Request 3: Complete Profile
```json
{
  "pan": "ABCDE1234F",
  "name": "John Doe",
  "dob": "1990-01-01",
  "email": "john.doe@example.com",
  "phone": "+91-9876543210",
  "address": "123 Main Street, Mumbai, Maharashtra"
}
```

### Sample Request 4: Minimal (Empty Body)
```json
{}
```

### Sample Request 5: With Additional Fields
```json
{
  "pan": "ABCDE1234F",
  "name": "John Doe",
  "dob": "1990-01-01",
  "aadhaar": "1234-5678-9012",
  "requestType": "FULL_REPORT",
  "purpose": "LOAN_APPLICATION"
}
```

---

## 2. CRIF API

**Endpoint:** `POST /api/crif`

### Sample Request 1: Basic PAN and Name
```json
{
  "pan": "FGHIJ5678K",
  "name": "Jane Smith"
}
```

### Sample Request 2: With Date of Birth
```json
{
  "pan": "FGHIJ5678K",
  "name": "Jane Smith",
  "dob": "1985-05-15"
}
```

### Sample Request 3: Complete Profile
```json
{
  "pan": "FGHIJ5678K",
  "name": "Jane Smith",
  "dob": "1985-05-15",
  "email": "jane.smith@example.com",
  "phone": "+91-9876543211",
  "address": "456 Park Avenue, Delhi, NCR"
}
```

### Sample Request 4: Minimal (Empty Body)
```json
{}
```

### Sample Request 5: With Additional Fields
```json
{
  "pan": "FGHIJ5678K",
  "name": "Jane Smith",
  "dob": "1985-05-15",
  "aadhaar": "2345-6789-0123",
  "requestType": "QUICK_REPORT",
  "purpose": "CREDIT_CARD_APPLICATION"
}
```

---

## 3. EXPERIAN API

**Endpoint:** `POST /api/experian`

### Sample Request 1: Basic PAN and Name
```json
{
  "pan": "LMNOP9012Q",
  "name": "Bob Johnson"
}
```

### Sample Request 2: With Date of Birth
```json
{
  "pan": "LMNOP9012Q",
  "name": "Bob Johnson",
  "dob": "1992-08-20"
}
```

### Sample Request 3: Complete Profile
```json
{
  "pan": "LMNOP9012Q",
  "name": "Bob Johnson",
  "dob": "1992-08-20",
  "email": "bob.johnson@example.com",
  "phone": "+91-9876543212",
  "address": "789 Business Park, Bangalore, Karnataka"
}
```

### Sample Request 4: Minimal (Empty Body)
```json
{}
```

### Sample Request 5: With Additional Fields
```json
{
  "pan": "LMNOP9012Q",
  "name": "Bob Johnson",
  "dob": "1992-08-20",
  "aadhaar": "3456-7890-1234",
  "requestType": "DETAILED_REPORT",
  "purpose": "HOME_LOAN"
}
```

---

## 4. EQUIFIX API

**Endpoint:** `POST /api/equifix`

### Sample Request 1: Basic PAN and Name
```json
{
  "pan": "RSTUV3456W",
  "name": "Alice Williams"
}
```

### Sample Request 2: With Date of Birth
```json
{
  "pan": "RSTUV3456W",
  "name": "Alice Williams",
  "dob": "1988-12-10"
}
```

### Sample Request 3: Complete Profile
```json
{
  "pan": "RSTUV3456W",
  "name": "Alice Williams",
  "dob": "1988-12-10",
  "email": "alice.williams@example.com",
  "phone": "+91-9876543213",
  "address": "321 Tech Hub, Hyderabad, Telangana"
}
```

### Sample Request 4: Minimal (Empty Body)
```json
{}
```

### Sample Request 5: With Additional Fields
```json
{
  "pan": "RSTUV3456W",
  "name": "Alice Williams",
  "dob": "1988-12-10",
  "aadhaar": "4567-8901-2345",
  "requestType": "STANDARD_REPORT",
  "purpose": "PERSONAL_LOAN"
}
```

---

## cURL Examples

### CIBIL
```bash
curl -X POST http://localhost:8081/mock-bureau/api/cibil \
  -H "Content-Type: application/json" \
  -d '{
    "pan": "ABCDE1234F",
    "name": "John Doe",
    "dob": "1990-01-01"
  }'
```

### CRIF
```bash
curl -X POST http://localhost:8081/mock-bureau/api/crif \
  -H "Content-Type: application/json" \
  -d '{
    "pan": "FGHIJ5678K",
    "name": "Jane Smith",
    "dob": "1985-05-15"
  }'
```

### EXPERIAN
```bash
curl -X POST http://localhost:8081/mock-bureau/api/experian \
  -H "Content-Type: application/json" \
  -d '{
    "pan": "LMNOP9012Q",
    "name": "Bob Johnson",
    "dob": "1992-08-20"
  }'
```

### EQUIFIX
```bash
curl -X POST http://localhost:8081/mock-bureau/api/equifix \
  -H "Content-Type: application/json" \
  -d '{
    "pan": "RSTUV3456W",
    "name": "Alice Williams",
    "dob": "1988-12-10"
  }'
```

---

## Response Format

All endpoints return a standardized response:

```json
{
  "success": true,
  "bureau": "CIBIL",
  "message": "Mock response from CIBIL bureau",
  "data": {
    "bureau": "CIBIL",
    "creditScore": 750,
    "reportNumber": "CIBIL-1234567890",
    "status": "ACTIVE",
    "accounts": {
      "account1": {
        "accountNumber": "ACC0001",
        "type": "LOAN",
        "status": "ACTIVE",
        "balance": 50000.0,
        "limit": 100000
      }
    },
    "enquiries": 5,
    "requestReceived": true,
    "processedAt": "2025-12-16T11:00:00",
    "requestData": {
      "pan": "ABCDE1234F",
      "name": "John Doe"
    }
  },
  "timestamp": "2025-12-16T11:00:00",
  "requestId": "uuid-here"
}
```

---

## Notes

1. **Flexible Request Body**: All endpoints accept any JSON structure. You can send any fields you want.

2. **Empty Body**: All endpoints work with an empty JSON object `{}` or no body at all.

3. **Request Data Echo**: Any data sent in the request will be included in the response under `data.requestData`.

4. **Bureau-Specific Fields**: 
   - **CRIF**: Includes `crifScore` field
   - **EXPERIAN**: Includes `experianScore` field
   - **EQUIFIX**: Includes `equifaxScore` field

5. **Unique Request ID**: Each response includes a unique `requestId` (UUID).

6. **Randomized Data**: Credit scores, account balances, and other numeric values are randomly generated for each request.

---

## Testing with Different Tools

### Using Postman
1. Set method to `POST`
2. URL: `http://localhost:8081/mock-bureau/api/{bureau-name}`
3. Headers: `Content-Type: application/json`
4. Body: Select "raw" and "JSON", paste any of the sample requests above

### Using HTTPie
```bash
http POST http://localhost:8081/mock-bureau/api/cibil \
  pan=ABCDE1234F \
  name="John Doe" \
  dob=1990-01-01
```

### Using JavaScript (Fetch API)
```javascript
fetch('http://localhost:8081/mock-bureau/api/cibil', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    pan: 'ABCDE1234F',
    name: 'John Doe',
    dob: '1990-01-01'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

