export type UserRole = 'PLATFORM_ADMIN' | 'CLIENT_ADMIN' | 'CLIENT_USER';

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  roles: string[];
  clientId?: string;
  clientName?: string;
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  userProfile: UserProfile;
  token: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  status: string;
  body: T;
}
