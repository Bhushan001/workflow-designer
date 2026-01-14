import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, RequestSchema } from '../../model/request-schema.model';
import { environment } from '../../../../environments/environment';
import { PageableResponse } from '../../model/pageable.model';

@Injectable({
    providedIn: 'root'
})
export class RequestSchemaService {

    constructor(private http: HttpClient) { }

    getAllRequestSchemas(page: number, pageSize: number): Observable<PageableResponse<RequestSchema>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', pageSize.toString());
        return this.http.get<PageableResponse<RequestSchema>>(`${environment.mapperUrl}/request-schemas`, { params });
    }

    getAllRequestSchemaDTOs(): Observable<RequestSchema> {
        return this.http.get<RequestSchema>(`${environment.mapperUrl}/request-schemas/dto`);
    }

    getRequestSchemaById(id: string): Observable<ApiResponse<RequestSchema>> {
        return this.http.get<ApiResponse<RequestSchema>>(`${environment.mapperUrl}/request-schemas/${id}`);
    }

    createRequestSchema(formData: FormData): Observable<RequestSchema> {
        return this.http.post<RequestSchema>(`${environment.mapperUrl}/request-schemas`, formData);
    }

    updateRequestSchema(id: string, requestSchema: RequestSchema): Observable<RequestSchema> {
        return this.http.put<RequestSchema>(`${environment.mapperUrl}/request-schemas/${id}`, requestSchema);
    }

    deleteRequestSchema(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.mapperUrl}/request-schemas/${id}`);
    }
}