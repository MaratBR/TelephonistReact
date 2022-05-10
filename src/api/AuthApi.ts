import ApiBase from './ApiBase';
import { api, rest } from './definition';

export default class AuthApi extends ApiBase implements api.IAuth {
  async changePassword(data: rest.ChangePassword): Promise<void> {
    await this.client.post('auth/reset-password-current', data);
  }

  getCSRFToken(): Promise<string> {
    return this.client.get('auth/csrf').then((r) => r.data);
  }

  async authorize(data: rest.LoginRequest): Promise<rest.LoginResponse> {
    return this.client.post('auth/login', data).then((r) => r.data);
  }

  async resetPassword(data: rest.ResetPassword) {
    await this.client.post('auth/reset-password', data);
  }

  whoami(): Promise<rest.WhoAmI> {
    return this.client.get('auth/whoami').then((r) => r.data);
  }

  async logout(): Promise<void> {
    await this.client.post('auth/logout');
  }
}
