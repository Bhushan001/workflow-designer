import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '@shared/models/auth.types';

export interface Client {
  id: string;
  clientCode: string;
  name: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPersonName?: string;
  websiteUrl?: string;
  industry?: string;
  companySize?: string;
  status?: string;
  timeZone?: string;
  locale?: string;
  maxUsers?: number;
  maxWorkflows?: number;
  billingContactEmail?: string;
  internalNotes?: string;
  createdBy?: string;
  createdByName?: string;
  createdOn?: string;
  updatedBy?: string;
  updatedByName?: string;
  updatedOn?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ClientsPageResponse {
  content: Client[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private http = inject(HttpClient);
  private baseUrl = environment.authApiUrl.replace('/auth', ''); // http://localhost:8081/api

  /**
   * Get paginated clients
   */
  getClients(page: number = 0, size: number = 10, search?: string): Observable<ApiResponse<ClientsPageResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ApiResponse<ClientsPageResponse>>(
      `${this.baseUrl}/clients/paginated`,
      { params }
    );
  }

  /**
   * Create a new client
   */
  createClient(client: Partial<Client>): Observable<ApiResponse<Client>> {
    return this.http.post<ApiResponse<Client>>(
      `${this.baseUrl}/clients`,
      client
    );
  }

  /**
   * Get all clients (for dropdowns)
   */
  getAllClients(): Observable<ApiResponse<Client[]>> {
    return this.http.get<ApiResponse<Client[]>>(
      `${this.baseUrl}/clients`
    );
  }
}