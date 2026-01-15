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
