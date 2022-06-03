import ApiBase from './ApiBase';
import { api, pagination, rest } from './definition';

export default class UsersApi extends ApiBase implements api.IUsers {
  async closeSession(userID: string, sessionRefID: string): Promise<void> {
    await this.client.delete(`users/${userID}/sessions/${sessionRefID}`);
  }

  getUsers(
    params: pagination.Params<'_id' | 'username'>
  ): Promise<pagination.Pagination<rest.User, string>> {
    return this.client.get('users', { params }).then((r) => r.data);
  }

  getUser(id: string): Promise<rest.UserResponse> {
    return this.client.get(`users/${id}`).then((r) => r.data);
  }

  create(body: rest.CreateUser): Promise<rest.User> {
    return this.client.post('users', body).then((r) => r.data);
  }

  async block(id: string, body: rest.BlockUser): Promise<void> {
    await this.client.post(`users/${id}/block`, body);
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`users/${id}`);
  }
}
