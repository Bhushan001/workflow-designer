import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mapping } from '../../model/mapping.model';
import { environment } from '../../../../environments/environment';
import { PageableResponse } from '../../model/pageable.model';

@Injectable({
    providedIn: 'root'
})
export class MappingService {

    constructor(private http: HttpClient) { }

    getAllMappings(page: number, pageSize: number): Observable<PageableResponse<Mapping>> {
        return this.http.get<PageableResponse<Mapping>>(`${environment.mapperUrl}/mappings`);
    }

    getAllMappingByRequestSchemaId(id: string): Observable<Mapping[]> {
        return this.http.get<Mapping[]>(`${environment.mapperUrl}/mappings/requestschema/${id}`);
    }

    getMappingById(id: string): Observable<Mapping> {
        return this.http.get<Mapping>(`${environment.mapperUrl}/mappings/${id}`);
    }

    saveMapping(mapping: Mapping, selectedRequestSchemaId: string): Observable<Mapping> {
        return this.http.post<Mapping>(`${environment.mapperUrl}/mappings/${selectedRequestSchemaId}`, mapping);
    }

    updateMapping(id: string, requestSchema: Mapping): Observable<Mapping> {
        return this.http.put<Mapping>(`${environment.mapperUrl}/mappings/${id}`, requestSchema);
    }

    deleteMapping(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.mapperUrl}/mappings/${id}`);
    }
}