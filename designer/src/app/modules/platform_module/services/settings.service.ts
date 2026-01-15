import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '@shared/models/auth.types';
import { PlatformSettings, SmtpTestRequest, SmtpTestResponse } from '../models/settings.types';

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
