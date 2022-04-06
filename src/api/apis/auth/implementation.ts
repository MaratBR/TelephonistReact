import ApiBase from '../../ApiBase';
import { IAuthApi } from './definition';
import { LoginRequest, LoginResponse, ResetPassword, WhoAmI } from 'api/definition';

export default class AuthApi extends ApiBase implements IAuthApi {
  getCSRFToken(): Promise<string> {
    return this.client.get('auth/csrf').then((r) => r.data);
  }

  async authorize(data: LoginRequest): Promise<LoginResponse> {
    return this.client.post('auth/login', data).then((r) => r.data);
  }

  async resetPassword(data: ResetPassword) {
    await this.client.post('auth/reset-password', data);
  }

  whoami(): Promise<WhoAmI> {
    return this.client.get('auth/whoami').then((r) => r.data);
  }

  async logout(): Promise<void> {
    await this.client.post('auth/logout');
  }
}
