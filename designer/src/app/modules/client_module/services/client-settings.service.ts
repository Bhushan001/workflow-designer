import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '@shared/models/auth.types';
import { ClientSettings } from '../models/settings.types';
import { SelectedClientService } from '@shared/services/selected-client.service';

@Injectable({ providedIn: 'root' })
export class ClientSettingsService {
  private http = inject(HttpClient);
  private selectedClientService = inject(SelectedClientService);
  private authApiUrl = environment.authApiUrl.replace('/auth', ''); // http://localhost:8081/api

  getSettings(): Observable<ApiResponse<ClientSettings>> {
    const selectedClient = this.selectedClientService.getSelectedClient();
    if (!selectedClient || !selectedClient.id) {
      throw new Error('Client ID is required');
    }
    return this.http.get<ApiResponse<ClientSettings>>(`${this.authApiUrl}/clients/${selectedClient.id}`);
  }

  updateSettings(settings: Partial<ClientSettings>): Observable<ApiResponse<ClientSettings>> {
    const selectedClient = this.selectedClientService.getSelectedClient();
    if (!selectedClient || !selectedClient.id) {
      throw new Error('Client ID is required');
    }
    return this.http.put<ApiResponse<ClientSettings>>(
      `${this.authApiUrl}/clients/${selectedClient.id}`,
      settings
    );
  }
}
