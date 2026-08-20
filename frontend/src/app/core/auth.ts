import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../features/auth/models/login-request';
import { RegisterRequest } from '../features/auth/models/register-request';
import { User } from '../features/auth/models/user';

import { ForgotPasswordRequest } from '../features/auth/models/forgot-password-request';
import { VerifyTokenRequest } from '../features/auth/models/verify-token-request';
import { ResetPasswordRequest } from '../features/auth/models/reset-password-request';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  readonly currentUser = signal<User | null>(null);
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials, { withCredentials: true })
      .pipe(tap(user => this.currentUser.set(user)));
  }

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, request);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, request);
  }

  verifyToken(request: VerifyTokenRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/verify-reset-token`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, request);
  }
}
