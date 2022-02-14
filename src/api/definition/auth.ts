export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  access_token: string | null;
  exp: string;
  // refresh_token // ignore it since we're not gonna use it anyway
  token_type: 'bearer';
  password_reset_required: boolean;
  password_reset_token: string | null;
}

export interface ResetPassword {
  password_reset_token: string;
  new_password: string;
}

export interface User {
  username: string;
  disabled: boolean;
  id: string;
  email: string;
  is_superuser: string;
  created_at: string;
}
