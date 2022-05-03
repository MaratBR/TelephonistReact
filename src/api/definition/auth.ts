export interface LoginRequest {
  username: string;
  password: string;
}

export interface PasswordResetResponse {
  detail: 'Password reset required';
  password_reset: {
    token: string;
    exp: string;
  };
}

interface LoggedInResponse {
  csrf: string;
  user: User;
  session_ref_id: string;
}

export type LoginResponse = LoggedInResponse | PasswordResetResponse;

export function isPasswordReset(o: LoginResponse): o is PasswordResetResponse {
  return (
    typeof o === 'object' &&
    o !== null &&
    typeof (o as any).password_reset === 'object' &&
    typeof (o as any).password_reset.token === 'string' &&
    typeof (o as any).password_reset.exp === 'string'
  );
}

export interface ResetPassword {
  password_reset_token: string;
  new_password: string;
}

export interface ChangePassword {
  new_password: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  disabled: boolean;
  id: string;
  email: string;
  is_superuser: boolean;
  created_at: string;
  is_blocked: boolean;
}

export interface WhoAmI {
  user: User;
  session_ref_id: string;
}

export interface AuthEvent {}
