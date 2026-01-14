import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workspace } from '../model/workspace.model';
import { environment } from '../../../environments/environment';
import { PageableResponse } from '../model/pageable.model';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
    private apiUrl = environment.apiUrl + '/api/workspaces';
  
    constructor(private http: HttpClient) {}
  
    getWorkspaces(page: number, pageSize: number): Observable<PageableResponse<Workspace>> {
      const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());
      return this.http.get<PageableResponse<Workspace>>(this.apiUrl, { params });
    }
  
    getWorkspace(id: string): Observable<Workspace> {
      return this.http.get<Workspace>(`${this.apiUrl}/${id}`);
    }
  
    createWorkspace(workspace: Partial<Workspace>): Observable<Workspace> {
      return this.http.post<Workspace>(this.apiUrl, workspace);
    }
  
    updateWorkspace(id: string, workspace: Partial<Workspace>): Observable<Workspace> {
      return this.http.put<Workspace>(`${this.apiUrl}/${id}`, workspace);
    }
  
    deleteWorkspace(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  }