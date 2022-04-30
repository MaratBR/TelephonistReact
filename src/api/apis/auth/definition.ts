import { ChangePassword, LoginRequest, LoginResponse, ResetPassword, WhoAmI } from 'api/definition';

export interface IAuthApi {
  authorize(data: LoginRequest): Promise<LoginResponse>;
  resetPassword(data: ResetPassword): Promise<void>;
  whoami(): Promise<WhoAmI>;
  getCSRFToken(): Promise<string>;
  logout(): Promise<void>;
  changePassword(data: ChangePassword): Promise<void>;
}
