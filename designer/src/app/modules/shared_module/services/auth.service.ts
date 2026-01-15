import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { LoginRequest, LoginResponse, UserProfile, ApiResponse } from '../models/auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authApiUrl = environment.authApiUrl;

  // Current user signal
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public currentUser = signal<UserProfile | null>(null);

  // Token storage
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor() {
    // Load user from localStorage on service initialization
    this.loadUserFromStorage();
  }

  /**
   * Login user with username/email and password
   */
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.authApiUrl}/login`,
      credentials
    ).pipe(
      tap(response => {
        if (response.body) {
          this.setAuthData(response.body);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  /**
   * Get current user
   */
  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) ?? false;
  }

  /**
   * Check if user is PLATFORM_ADMIN
   */
  isPlatformAdmin(): boolean {
    return this.hasRole('PLATFORM_ADMIN');
  }

  /**
   * Check if user is CLIENT_ADMIN
   */
  isClientAdmin(): boolean {
    return this.hasRole('CLIENT_ADMIN');
  }

  /**
   * Check if user is CLIENT_USER
   */
  isClientUser(): boolean {
    return this.hasRole('CLIENT_USER');
  }

  /**
   * Get primary role (first role in the roles array)
   */
  getPrimaryRole(): string | null {
    const user = this.getCurrentUser();
    return user?.roles?.[0] ?? null;
  }

  /**
   * Set authentication data
   */
  private setAuthData(loginResponse: LoginResponse): void {
    // Store token
    localStorage.setItem(this.TOKEN_KEY, loginResponse.token);
    
    // Store user profile
    localStorage.setItem(this.USER_KEY, JSON.stringify(loginResponse.userProfile));
    
    // Update signals and subjects
    this.currentUser.set(loginResponse.userProfile);
    this.currentUserSubject.next(loginResponse.userProfile);
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.currentUserSubject.next(null);
  }

  /**
   * Load user from localStorage
   */
  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);
    
    if (token && userStr) {
      try {
        const user: UserProfile = JSON.parse(userStr);
        this.currentUser.set(user);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user from storage:', error);
        this.clearAuthData();
      }
    }
  }
}
