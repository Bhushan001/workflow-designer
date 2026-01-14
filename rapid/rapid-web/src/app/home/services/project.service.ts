import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../model/project.model';
import { PageableResponse } from '../model/pageable.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
    private apiUrl = environment.apiUrl + '/api/workspaces';
  
    constructor(private http: HttpClient) {}
  
    getProjectsByWorkspaceId(selectedWorkspaceId: string, page: number, pageSize: number): Observable<PageableResponse<Project>> {
      const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());
      return this.http.get<PageableResponse<Project>>(`${this.apiUrl}/${selectedWorkspaceId}/projects`, { params });
    }
  
    getProjectByWorkspaceIdAndProjectId(selectedWorkspaceId: string, id: string): Observable<Project> {
      return this.http.get<Project>(`${this.apiUrl}/${selectedWorkspaceId}/projects/${id}`);
    }
  
    createProject(selectedWorkspaceId: string,project: Partial<Project>): Observable<Project> {
      return this.http.post<Project>(`${this.apiUrl}/${selectedWorkspaceId}/projects`, project);
    }
  
    updateProject(selectedWorkspaceId: string, projectId: string, project: Partial<Project>): Observable<Project> {
      return this.http.put<Project>(`${this.apiUrl}/${selectedWorkspaceId}/projects/${projectId}`, project);
    }
  
    deleteProject(selectedWorkspaceId: string, id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${selectedWorkspaceId}/projects/${id}`);
    }
  }