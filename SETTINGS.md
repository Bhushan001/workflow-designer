# Platform Settings - Developer Roadmap

This document outlines all the backend and frontend changes needed to implement the Platform Settings functionality.

## Overview

Platform Settings will allow PLATFORM_ADMIN users to configure system-wide settings, security policies, default quotas, email configuration, and other administrative preferences.

---

## Backend Changes

### 1. Database Schema Changes

#### 1.1 Create `platform_settings` Table

**Liquibase Migration**: `004-create-platform-settings-table.xml`

```sql
CREATE TABLE platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- General Settings
    platform_name VARCHAR(255) NOT NULL DEFAULT 'Workflow Designer',
    platform_email VARCHAR(255),
    default_timezone VARCHAR(100) DEFAULT 'UTC',
    default_locale VARCHAR(10) DEFAULT 'en',
    platform_description TEXT,
    
    -- Security Settings
    password_min_length INTEGER DEFAULT 8,
    password_require_uppercase BOOLEAN DEFAULT true,
    password_require_lowercase BOOLEAN DEFAULT true,
    password_require_numbers BOOLEAN DEFAULT true,
    password_require_special_chars BOOLEAN DEFAULT true,
    session_timeout_minutes INTEGER DEFAULT 30,
    jwt_token_expiration_hours INTEGER DEFAULT 24,
    max_login_attempts INTEGER DEFAULT 5,
    lockout_duration_minutes INTEGER DEFAULT 15,
    enable_email_login BOOLEAN DEFAULT true,
    
    -- Default Quotas
    default_max_users_per_client INTEGER,
    default_max_workflows_per_client INTEGER,
    default_storage_quota_mb INTEGER,
    
    -- Email/SMTP Configuration
    smtp_host VARCHAR(255),
    smtp_port INTEGER DEFAULT 587,
    smtp_username VARCHAR(255),
    smtp_password VARCHAR(255), -- Encrypted
    smtp_enable_tls BOOLEAN DEFAULT true,
    smtp_from_email VARCHAR(255),
    smtp_from_name VARCHAR(255),
    
    -- System Configuration
    maintenance_mode BOOLEAN DEFAULT false,
    maintenance_message TEXT,
    system_status VARCHAR(50) DEFAULT 'ACTIVE',
    
    -- Auditable fields
    created_by UUID,
    updated_by UUID,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.2 Create Settings Entity

**File**: `auth-service/src/main/java/com/workflow/auth/entity/PlatformSettings.java`

```java
@Entity
@Table(name = "platform_settings")
@Data
@EqualsAndHashCode(callSuper = true)
public class PlatformSettings extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    // General Settings
    @Column(name = "platform_name", nullable = false)
    private String platformName;
    
    @Column(name = "platform_email")
    private String platformEmail;
    
    @Column(name = "default_timezone")
    private String defaultTimezone;
    
    @Column(name = "default_locale")
    private String defaultLocale;
    
    @Column(name = "platform_description", columnDefinition = "TEXT")
    private String platformDescription;
    
    // Security Settings
    @Column(name = "password_min_length")
    private Integer passwordMinLength;
    
    @Column(name = "password_require_uppercase")
    private Boolean passwordRequireUppercase;
    
    @Column(name = "password_require_lowercase")
    private Boolean passwordRequireLowercase;
    
    @Column(name = "password_require_numbers")
    private Boolean passwordRequireNumbers;
    
    @Column(name = "password_require_special_chars")
    private Boolean passwordRequireSpecialChars;
    
    @Column(name = "session_timeout_minutes")
    private Integer sessionTimeoutMinutes;
    
    @Column(name = "jwt_token_expiration_hours")
    private Integer jwtTokenExpirationHours;
    
    @Column(name = "max_login_attempts")
    private Integer maxLoginAttempts;
    
    @Column(name = "lockout_duration_minutes")
    private Integer lockoutDurationMinutes;
    
    @Column(name = "enable_email_login")
    private Boolean enableEmailLogin;
    
    // Default Quotas
    @Column(name = "default_max_users_per_client")
    private Integer defaultMaxUsersPerClient;
    
    @Column(name = "default_max_workflows_per_client")
    private Integer defaultMaxWorkflowsPerClient;
    
    @Column(name = "default_storage_quota_mb")
    private Integer defaultStorageQuotaMb;
    
    // Email/SMTP Configuration (consider encryption for password)
    @Column(name = "smtp_host")
    private String smtpHost;
    
    @Column(name = "smtp_port")
    private Integer smtpPort;
    
    @Column(name = "smtp_username")
    private String smtpUsername;
    
    @Column(name = "smtp_password") // Should be encrypted
    private String smtpPassword;
    
    @Column(name = "smtp_enable_tls")
    private Boolean smtpEnableTls;
    
    @Column(name = "smtp_from_email")
    private String smtpFromEmail;
    
    @Column(name = "smtp_from_name")
    private String smtpFromName;
    
    // System Configuration
    @Column(name = "maintenance_mode")
    private Boolean maintenanceMode;
    
    @Column(name = "maintenance_message", columnDefinition = "TEXT")
    private String maintenanceMessage;
    
    @Column(name = "system_status")
    private String systemStatus;
}
```

#### 1.3 Create Settings DTO

**File**: `auth-service/src/main/java/com/workflow/auth/dto/PlatformSettingsDto.java`

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlatformSettingsDto {
    private UUID id;
    
    // General Settings
    private String platformName;
    private String platformEmail;
    private String defaultTimezone;
    private String defaultLocale;
    private String platformDescription;
    
    // Security Settings
    private Integer passwordMinLength;
    private Boolean passwordRequireUppercase;
    private Boolean passwordRequireLowercase;
    private Boolean passwordRequireNumbers;
    private Boolean passwordRequireSpecialChars;
    private Integer sessionTimeoutMinutes;
    private Integer jwtTokenExpirationHours;
    private Integer maxLoginAttempts;
    private Integer lockoutDurationMinutes;
    private Boolean enableEmailLogin;
    
    // Default Quotas
    private Integer defaultMaxUsersPerClient;
    private Integer defaultMaxWorkflowsPerClient;
    private Integer defaultStorageQuotaMb;
    
    // Email/SMTP Configuration
    private String smtpHost;
    private Integer smtpPort;
    private String smtpUsername;
    private String smtpFromEmail;
    private String smtpFromName;
    private Boolean smtpEnableTls;
    // Note: smtpPassword should NOT be returned in DTO for security
    
    // System Configuration
    private Boolean maintenanceMode;
    private String maintenanceMessage;
    private String systemStatus;
    
    // Metadata
    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;
    private UUID createdBy;
    private UUID updatedBy;
}
```

### 2. Repository Layer

**File**: `auth-service/src/main/java/com/workflow/auth/repository/PlatformSettingsRepository.java`

```java
@Repository
public interface PlatformSettingsRepository extends JpaRepository<PlatformSettings, UUID> {
    // Since there's only one settings record, we can have a helper method
    @Query("SELECT s FROM PlatformSettings s ORDER BY s.updatedOn DESC LIMIT 1")
    Optional<PlatformSettings> findLatest();
    
    // Or use a singleton pattern with a specific ID
    // For now, we'll get the first/only record
    Optional<PlatformSettings> findFirstByOrderByCreatedOnAsc();
}
```

### 3. Service Layer

**File**: `auth-service/src/main/java/com/workflow/auth/service/PlatformSettingsService.java`

**Methods needed:**
- `getSettings()` - Get current platform settings
- `updateSettings(PlatformSettingsDto dto)` - Update settings (only PLATFORM_ADMIN)
- `initializeDefaultSettings()` - Create default settings if none exist (on startup)
- `validatePasswordPolicy(String password)` - Validate password against current policy
- `testSmtpConnection()` - Test SMTP configuration

**Implementation Notes:**
- Encrypt SMTP password before storing
- Decrypt SMTP password when needed for sending emails
- Apply password policy validation when users change passwords
- Use settings in UserService for password validation

### 4. Controller Layer

**File**: `auth-service/src/main/java/com/workflow/auth/controller/PlatformSettingsController.java`

**Endpoints:**
```
GET    /api/platform/settings           - Get current settings
PUT    /api/platform/settings           - Update settings (PLATFORM_ADMIN only)
POST   /api/platform/settings/test-smtp - Test SMTP configuration (PLATFORM_ADMIN only)
POST   /api/platform/settings/reset     - Reset to defaults (PLATFORM_ADMIN only)
```

**Security:**
- All endpoints require `PLATFORM_ADMIN` role
- Use `@PreAuthorize("hasAuthority('PLATFORM_ADMIN')")`

### 5. Validation & Encryption

**Password Encryption for SMTP:**
- Use Spring's `PasswordEncoder` or `Encryptors` from Spring Security
- Or use Java's `Cipher` with AES encryption
- Store encryption key securely (environment variable or encrypted config)

**Password Policy Validation:**
- Create `PasswordPolicyValidator` utility class
- Update `UserService.updatePassword()` to use this validator
- Apply during user registration and password updates

---

## Frontend Changes

### 1. TypeScript Models

**File**: `designer/src/app/modules/platform_module/models/settings.types.ts`

```typescript
export interface PlatformSettings {
  id?: string;
  
  // General Settings
  platformName: string;
  platformEmail?: string;
  defaultTimezone?: string;
  defaultLocale?: string;
  platformDescription?: string;
  
  // Security Settings
  passwordMinLength?: number;
  passwordRequireUppercase?: boolean;
  passwordRequireLowercase?: boolean;
  passwordRequireNumbers?: boolean;
  passwordRequireSpecialChars?: boolean;
  sessionTimeoutMinutes?: number;
  jwtTokenExpirationHours?: number;
  maxLoginAttempts?: number;
  lockoutDurationMinutes?: number;
  enableEmailLogin?: boolean;
  
  // Default Quotas
  defaultMaxUsersPerClient?: number;
  defaultMaxWorkflowsPerClient?: number;
  defaultStorageQuotaMb?: number;
  
  // Email/SMTP Configuration
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string; // Only for updates, never returned from GET
  smtpFromEmail?: string;
  smtpFromName?: string;
  smtpEnableTls?: boolean;
  
  // System Configuration
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
  systemStatus?: string;
  
  // Metadata
  createdOn?: string;
  updatedOn?: string;
}

export interface SmtpTestRequest {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpEnableTls: boolean;
  testEmail: string; // Email to send test message to
}

export interface SmtpTestResponse {
  success: boolean;
  message: string;
}
```

### 2. Settings Service

**File**: `designer/src/app/modules/platform_module/services/settings.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private http = inject(HttpClient);
  private baseUrl = environment.authApiUrl.replace('/auth', ''); // http://localhost:8081/api

  getSettings(): Observable<ApiResponse<PlatformSettings>> {
    return this.http.get<ApiResponse<PlatformSettings>>(`${this.baseUrl}/platform/settings`);
  }

  updateSettings(settings: PlatformSettings): Observable<ApiResponse<PlatformSettings>> {
    return this.http.put<ApiResponse<PlatformSettings>>(
      `${this.baseUrl}/platform/settings`,
      settings
    );
  }

  testSmtpConnection(request: SmtpTestRequest): Observable<ApiResponse<SmtpTestResponse>> {
    return this.http.post<ApiResponse<SmtpTestResponse>>(
      `${this.baseUrl}/platform/settings/test-smtp`,
      request
    );
  }

  resetToDefaults(): Observable<ApiResponse<PlatformSettings>> {
    return this.http.post<ApiResponse<PlatformSettings>>(
      `${this.baseUrl}/platform/settings/reset`,
      {}
    );
  }
}
```

### 3. Settings Component

**File**: `designer/src/app/modules/platform_module/pages/settings/settings.component.ts`

**Structure:**
- Reactive form with multiple sections (tabs or accordion)
- Form sections:
  1. General Settings
  2. Security Settings
  3. Default Quotas
  4. Email Configuration
  5. System Configuration

**Features:**
- Load settings on init
- Save settings with validation
- Test SMTP connection button
- Reset to defaults button
- Success/error notifications

### 4. Settings Component Template

**File**: `designer/src/app/modules/platform_module/pages/settings/settings.component.html`

**Layout:**
- Tab-based or Accordion-based navigation between sections
- Each section as a separate form section
- Save button at bottom (saves all sections)
- Reset button (with confirmation dialog)

**Sections:**

1. **General Settings Tab**
   - Platform Name (text input)
   - Platform Email (email input)
   - Default Timezone (dropdown/select)
   - Default Locale (dropdown/select)
   - Platform Description (textarea)

2. **Security Settings Tab**
   - Password Policy section
     - Min Length (number input)
     - Require Uppercase (checkbox)
     - Require Lowercase (checkbox)
     - Require Numbers (checkbox)
     - Require Special Chars (checkbox)
   - Session Settings section
     - Session Timeout (number input, minutes)
     - JWT Token Expiration (number input, hours)
   - Login Security section
     - Max Login Attempts (number input)
     - Lockout Duration (number input, minutes)
     - Enable Email Login (checkbox)

3. **Default Quotas Tab**
   - Default Max Users per Client (number input)
   - Default Max Workflows per Client (number input)
   - Default Storage Quota (number input, MB)

4. **Email Configuration Tab**
   - SMTP Server (text input)
   - SMTP Port (number input)
   - SMTP Username (text input)
   - SMTP Password (password input)
   - Enable TLS (checkbox)
   - From Email (email input)
   - From Name (text input)
   - "Test SMTP Connection" button

5. **System Configuration Tab**
   - Maintenance Mode (toggle/checkbox)
   - Maintenance Message (textarea)
   - System Status (readonly display)

### 5. Styling

**File**: `designer/src/app/modules/platform_module/pages/settings/settings.component.scss`

- Match form styling from add-client/add-user forms
- 3-column layout where appropriate
- Tabs/Accordion styling
- Section dividers
- Consistent with rest of the application

---

## Implementation Phases

### Phase 1: Basic Structure (MVP)
**Priority: High**

1. ✅ Create database table and entity
2. ✅ Create DTO
3. ✅ Create repository
4. ✅ Create service with basic CRUD
5. ✅ Create controller with GET and PUT endpoints
6. ✅ Frontend service
7. ✅ Frontend component with General Settings only
8. ✅ Basic form with save functionality

### Phase 2: Security Settings
**Priority: High**

1. ✅ Add security settings fields
2. ✅ Update entity and DTO
3. ✅ Implement password policy validator
4. ✅ Update UserService to use password policy
5. ✅ Frontend form for security settings
6. ✅ Apply validation in user registration/update

### Phase 3: Default Quotas
**Priority: Medium**

1. ✅ Add quota fields
2. ✅ Use default quotas when creating new clients
3. ✅ Frontend form for quota settings

### Phase 4: Email Configuration
**Priority: Medium**

1. ✅ Add SMTP fields
2. ✅ Implement password encryption for SMTP
3. ✅ Create email service utility
4. ✅ SMTP test endpoint
5. ✅ Frontend form with test button

### Phase 5: System Configuration
**Priority: Low**

1. ✅ Add system config fields
2. ✅ Maintenance mode middleware/filter
3. ✅ Frontend form for system config

---

## API Endpoints Specification

### GET /api/platform/settings
**Description**: Get current platform settings

**Authorization**: `PLATFORM_ADMIN`

**Response**:
```json
{
  "statusCode": 200,
  "status": "OK",
  "body": {
    "id": "uuid",
    "platformName": "Workflow Designer",
    "platformEmail": "admin@example.com",
    "defaultTimezone": "America/New_York",
    "defaultLocale": "en",
    // ... all other fields
    // Note: smtpPassword is NOT included
  }
}
```

### PUT /api/platform/settings
**Description**: Update platform settings

**Authorization**: `PLATFORM_ADMIN`

**Request Body**:
```json
{
  "platformName": "Updated Name",
  "defaultTimezone": "UTC",
  "passwordMinLength": 10,
  // ... any fields to update
}
```

**Response**:
```json
{
  "statusCode": 200,
  "status": "OK",
  "body": {
    // Updated settings object
  }
}
```

### POST /api/platform/settings/test-smtp
**Description**: Test SMTP configuration

**Authorization**: `PLATFORM_ADMIN`

**Request Body**:
```json
{
  "smtpHost": "smtp.gmail.com",
  "smtpPort": 587,
  "smtpUsername": "user@gmail.com",
  "smtpPassword": "password",
  "smtpEnableTls": true,
  "testEmail": "test@example.com"
}
```

**Response**:
```json
{
  "statusCode": 200,
  "status": "OK",
  "body": {
    "success": true,
    "message": "SMTP connection successful. Test email sent."
  }
}
```

### POST /api/platform/settings/reset
**Description**: Reset settings to defaults

**Authorization**: `PLATFORM_ADMIN`

**Request Body**: Empty or `{}`

**Response**:
```json
{
  "statusCode": 200,
  "status": "OK",
  "body": {
    // Settings with default values
  }
}
```

---

## Database Initialization

### Default Settings Record

On application startup, if no settings exist, create a default record:

**File**: `auth-service/src/main/java/com/workflow/auth/config/SettingsInitializer.java`

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class SettingsInitializer implements ApplicationListener<ContextRefreshedEvent> {
    private final PlatformSettingsRepository settingsRepository;
    private final PlatformSettingsService settingsService;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (settingsRepository.count() == 0) {
            log.info("No platform settings found. Creating default settings...");
            settingsService.initializeDefaultSettings();
        }
    }
}
```

---

## Password Policy Implementation

### Backend Validator

**File**: `auth-service/src/main/java/com/workflow/auth/util/PasswordPolicyValidator.java`

```java
@Component
@RequiredArgsConstructor
public class PasswordPolicyValidator {
    private final PlatformSettingsService settingsService;

    public ValidationResult validatePassword(String password) {
        PlatformSettingsDto settings = settingsService.getSettings();
        
        List<String> errors = new ArrayList<>();
        
        if (password.length() < settings.getPasswordMinLength()) {
            errors.add("Password must be at least " + settings.getPasswordMinLength() + " characters");
        }
        
        if (settings.getPasswordRequireUppercase() && !password.matches(".*[A-Z].*")) {
            errors.add("Password must contain at least one uppercase letter");
        }
        
        if (settings.getPasswordRequireLowercase() && !password.matches(".*[a-z].*")) {
            errors.add("Password must contain at least one lowercase letter");
        }
        
        if (settings.getPasswordRequireNumbers() && !password.matches(".*[0-9].*")) {
            errors.add("Password must contain at least one number");
        }
        
        if (settings.getPasswordRequireSpecialChars() && !password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            errors.add("Password must contain at least one special character");
        }
        
        return new ValidationResult(errors.isEmpty(), errors);
    }
}
```

---

## Frontend Component Structure

### Settings Component with Tabs

```
settings.component.html
├── Page Header
├── Tab Navigation
│   ├── General
│   ├── Security
│   ├── Quotas
│   ├── Email
│   └── System
├── Tab Content (conditional rendering)
│   └── Form Sections
└── Action Buttons (Save, Reset, Test SMTP)
```

### Form Validation

- Client-side validation matching backend rules
- Real-time validation feedback
- Password policy preview/helper text
- SMTP test with loading state

---

## Testing Requirements

### Backend Tests
- Unit tests for SettingsService
- Unit tests for PasswordPolicyValidator
- Integration tests for SettingsController
- SMTP connection test

### Frontend Tests
- Component tests for SettingsComponent
- Service tests for SettingsService
- Form validation tests
- Integration tests for save/load flow

---

## Security Considerations

1. **SMTP Password Encryption**
   - Never store plaintext passwords
   - Use AES encryption with secure key management
   - Environment variable for encryption key

2. **Authorization**
   - All endpoints require PLATFORM_ADMIN role
   - Verify role in controller and service layers

3. **Input Validation**
   - Validate all inputs server-side
   - Sanitize user inputs
   - Prevent SQL injection (using JPA)

4. **Audit Trail**
   - Log all settings changes
   - Track who changed what and when

---

## Migration Path

1. Create database migration
2. Deploy backend changes
3. Initialize default settings
4. Deploy frontend changes
5. Test end-to-end flow
6. Apply password policy to existing password change flows

---

## Future Enhancements

1. **Settings History/Versioning**
   - Track settings changes over time
   - Ability to revert to previous versions

2. **Feature Flags**
   - Enable/disable features per client
   - A/B testing capabilities

3. **Advanced Email Templates**
   - Customizable email templates
   - Rich text editor for templates

4. **Audit Log Viewer**
   - UI to view settings change history
   - Filter and search capabilities

5. **Import/Export Settings**
   - Export settings as JSON
   - Import settings from file

---

## Notes

- Consider using a single settings record with a known UUID or singleton pattern
- SMTP password should be encrypted at rest
- Password policy should be applied retroactively where possible (on next password change)
- Settings should be cached in memory for performance, invalidate on update
- Consider using Redis cache for distributed systems
