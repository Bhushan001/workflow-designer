// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../../model/user.model';
import { PageableResponse } from '../../../home/model/pageable.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor(
        private http: HttpClient
    ) { }

    getUsers(page: number, pageSize: number): Observable<PageableResponse<User>> {
        return this.http.get<PageableResponse<User>>(`${environment.apiUrl}/api/users`);
    }
}
