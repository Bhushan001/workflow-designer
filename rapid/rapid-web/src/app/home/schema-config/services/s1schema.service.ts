import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { S1Schema } from '../../model/s1-schema.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class S1SchemaService {

    constructor(private http: HttpClient) { }

    getAllS1Schemas(): Observable<S1Schema[]> {
        return this.http.get<S1Schema[]>(`${environment.mapperUrl}/s1-schemas`);
    }

    getAllS1SchemasByRequestSchemaId(id: string): Observable<S1Schema[]> {
        return this.http.get<S1Schema[]>(`${environment.mapperUrl}/s1-schemas/requestschema/${id}`);
    }

    getS1SchemaById(id: string): Observable<S1Schema> {
        return this.http.get<S1Schema>(`${environment.mapperUrl}/s1-schemas/${id}`);
    }

    createS1Schema(formData: FormData): Observable<S1Schema> {
        return this.http.post<S1Schema>(`${environment.mapperUrl}/s1-schemas`, formData);
    }

    updateS1Schema(id: string, requestSchema: S1Schema): Observable<S1Schema> {
        return this.http.put<S1Schema>(`${environment.mapperUrl}/s1-schemas/${id}`, requestSchema);
    }

    deleteS1Schema(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.mapperUrl}/s1-schemas/${id}`);
    }
}