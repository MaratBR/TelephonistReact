import { LoginRequest, LoginResponse, ResetPassword, User } from 'api/definition';

export const AUTH_API_DI_KEY = Symbol.for('Auth API');
export interface IAuthApi {
  authorize(data: LoginRequest): Promise<LoginResponse>;
  resetPassword(data: ResetPassword): Promise<void>;
  getUser(): Promise<User>;
  refreshToken(): Promise<LoginResponse>;
}
