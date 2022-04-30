import IConnectionsApi from './definition';
import ApiBase from 'api/ApiBase';
import { ConnectionInfo } from 'api/definition';

export default class ConnectionsApi extends ApiBase implements IConnectionsApi {
  get(id: string): Promise<ConnectionInfo> {
    return this.client.get(`connections/${id}`).then((v) => v.data);
  }
}
