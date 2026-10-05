export interface ForgotPasswordRequest {
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface User {
  uid: number;
  username: string;
  firstName: string;
  lastName: string;
  activated: boolean;
}

export interface VerifyTokenRequest {
  email: string;
  token: string;
}
