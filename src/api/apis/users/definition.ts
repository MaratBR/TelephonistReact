import { Pagination, PaginationParams, User } from 'api/definition';
import { BlockUser, CreateUser, UserResponse } from 'api/definition/users';

export default interface IUsersApi {
  getUsers(params: PaginationParams<'_id' | 'username'>): Promise<Pagination<User>>;
  getUser(id: string): Promise<UserResponse>;
  create(body: CreateUser): Promise<User>;
  block(id: string, body: BlockUser): Promise<void>;
  closeSession(userID: string, sessionRefID: string): Promise<void>;
}
