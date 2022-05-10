import ApiBase from './ApiBase';
import { api, rest } from './definition';

export default class ConnectionsApi extends ApiBase implements api.IConnections {
  get(id: string): Promise<rest.ConnectionInfo> {
    return this.client.get(`connections/${id}`).then((v) => v.data);
  }
}
