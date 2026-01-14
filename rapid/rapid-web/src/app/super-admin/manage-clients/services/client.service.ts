import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ApiResponse<T> {
  statusCode: number;
  status: string;
  data: T;
}

interface CustomErrorResponse {
  statusCode: number;
  status: string;
  errorCode: string;
  message: string;
}

interface Client {
  clientId?: string; // UUID, optional for create
  clientName: string;
  clientDescription: string;
  // Add other client properties as needed
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'http://localhost:8081/api/clients'; // Adjust if needed

  constructor(private http: HttpClient) {}

  createClient(client: Client): Observable<ApiResponse<Client> | CustomErrorResponse> {
    return this.http.post<ApiResponse<Client> | CustomErrorResponse>(this.apiUrl, client);
  }

  updateClient(clientId: string, client: Client): Observable<ApiResponse<Client>> {
    return this.http.put<ApiResponse<Client>>(`${this.apiUrl}/${clientId}`, client);
  }

  deleteClient(clientId: string): Observable<ApiResponse<void> | CustomErrorResponse> {
    const url = `${this.apiUrl}/${clientId}`;
    return this.http.delete<ApiResponse<void> | CustomErrorResponse>(url);
  }

  getAllClients(): Observable<ApiResponse<Client[]>> {
    return this.http.get<ApiResponse<Client[]>>(this.apiUrl);
  }
}