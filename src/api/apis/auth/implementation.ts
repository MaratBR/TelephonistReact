import ApiBase from '../../ApiBase';
import { IAuthApi } from './definition';
import { LoginRequest, LoginResponse, ResetPassword, User } from 'api/definition';
import { injectable } from 'inversify';

@injectable()
export default class AuthApi extends ApiBase implements IAuthApi {
  authorize(data: LoginRequest): Promise<LoginResponse> {
    return this._apiCall(this._client.post('auth/token', data));
  }

  async resetPassword(data: ResetPassword) {
    await this._apiCall(this._client.post('auth/reset-password', data));
  }

  refreshToken(): Promise<LoginResponse> {
    return this._apiCall(this._client.post('auth/refresh'));
  }

  getUser(): Promise<User> {
    return this._apiCall(this._client.get('auth/user'));
  }
}
