// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastService } from './toast.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8081/api';
    private jwtHelper = new JwtHelperService();

    constructor(
        private http: HttpClient,
        private toastr: ToastService
    ) { }

    getRoles(): string[] {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedToken = this.jwtHelper.decodeToken(token);
            return decodedToken?.roles || []; // Assuming roles are in 'roles' claim
        }
        return [];
    }

    hasRole(role: string): boolean {
        return this.getRoles().includes(role);
    }

    validateToken(): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/jwt/validate-token`);
    }

    isAuthenticated(): boolean {
        return true;
    }

    signup(payload: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/signup`, payload);
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/login`, credentials);
    }

    logout(): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/logout`, null);
    }
}
