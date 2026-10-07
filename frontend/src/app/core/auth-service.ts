import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyTokenRequest,
  ResetPasswordRequest,
  User,
} from './auth-models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth';

  readonly currentUser = signal<User | null>(null);
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  http = inject(HttpClient);

  me(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, {withCredentials: true}).pipe(tap((user) => this.currentUser.set(user)));
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/login`, credentials, { withCredentials: true })
      .pipe(tap((user) => this.currentUser.set(user)));
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
