import IUsersApi from './definition';
import ApiBase from 'api/ApiBase';
import { Pagination, PaginationParams, User } from 'api/definition';
import { BlockUser, CreateUser, UserResponse } from 'api/definition/users';

export default class UsersApi extends ApiBase implements IUsersApi {
  async closeSession(userID: string, sessionRefID: string): Promise<void> {
    await this.client.delete(`users/${userID}/sessions/${sessionRefID}`);
  }

  getUsers(params: PaginationParams<'_id' | 'username'>): Promise<Pagination<User, string>> {
    return this.client.get('users', { params }).then((r) => r.data);
  }

  getUser(id: string): Promise<UserResponse> {
    return this.client.get(`users/${id}`).then((r) => r.data);
  }

  create(body: CreateUser): Promise<User> {
    return this.client.post('users', body).then((r) => r.data);
  }

  async block(id: string, body: BlockUser): Promise<void> {
    await this.client.post(`users/${id}/block`, body);
  }
}
