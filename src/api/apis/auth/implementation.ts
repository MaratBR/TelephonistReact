import ApiBase from '../../ApiBase';
import { IAuthApi } from './definition';
import { LoginRequest, LoginResponse, ResetPassword, User } from 'api/definition';

export default class AuthApi extends ApiBase implements IAuthApi {
  authorize(data: LoginRequest): Promise<LoginResponse> {
    return this.statusService.apiCall(this._client.post('auth/token', data));
  }

  async resetPassword(data: ResetPassword) {
    await this.statusService.apiCall(this._client.post('auth/reset-password', data));
  }

  refreshToken(): Promise<LoginResponse> {
    return this.statusService.apiCall(this._client.post('auth/refresh'));
  }

  getUser(): Promise<User> {
    return this.statusService.apiCall(this._client.get('auth/user'));
  }
}
