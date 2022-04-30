import { ConnectionInfo } from 'api/definition';

export default interface IConnectionsApi {
  get(id: string): Promise<ConnectionInfo>;
}
