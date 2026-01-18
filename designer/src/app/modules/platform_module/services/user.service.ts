import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '@shared/models/auth.types';

export interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  country?: string;
  roles?: string[];
  clientId?: string;
  createdBy?: string;
  createdByName?: string;
  createdOn?: string;
  updatedBy?: string;
  updatedByName?: string;
  updatedOn?: string;
}

export interface UsersPageResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private authApiUrl = environment.authApiUrl; // http://localhost:8081/api/auth

  /**
   * Get paginated users
   */
  getUsers(page: number = 0, size: number = 10, search?: string): Observable<ApiResponse<UsersPageResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ApiResponse<UsersPageResponse>>(
      `${this.authApiUrl}/users/paginated`,
      { params }
    );
  }

  /**
   * Create a new user
   * For PLATFORM_ADMIN: creates CLIENT_ADMIN via /createClientAdmin
   * For CLIENT_ADMIN: creates CLIENT_USER via /createClientUser
   */
  createUser(user: Partial<User>): Observable<ApiResponse<any>> {
    // Determine which endpoint to use based on current route
    const isClientRoute = window.location.pathname.includes('/client/users/new');
    const endpoint = isClientRoute ? '/createClientUser' : '/createClientAdmin';
    
    return this.http.post<ApiResponse<any>>(
      `${this.authApiUrl}${endpoint}`,
      user
    );
  }

  /**
   * Get a single user by ID
   */
  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(
      `${this.authApiUrl}/users/${id}`
    );
  }

  /**
   * Update a user
   */
  updateUser(id: string, user: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(
      `${this.authApiUrl}/users/${id}`,
      user
    );
  }

  /**
   * Delete a user
   */
  deleteUser(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.authApiUrl}/users/${id}`
    );
  }

  /**
   * Get paginated users by client ID
   */
  getUsersByClientId(clientId: string, page: number = 0, size: number = 10, search?: string): Observable<ApiResponse<UsersPageResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ApiResponse<UsersPageResponse>>(
      `${this.authApiUrl}/users/client/${clientId}/paginated`,
      { params }
    );
  }
}