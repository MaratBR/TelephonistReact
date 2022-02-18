import AuthState from './auth';
import { WSState } from './ws';
import { Api } from 'api/apiImplementation';
import { getAxiosInstance } from 'api/client';

export class RootState {
  auth: AuthState;

  ws: WSState;

  api: Api;

  constructor() {
    this.api = new Api(getAxiosInstance());
    this.auth = new AuthState(this.api);
    this.ws = new WSState(this.auth);
  }
}

const state = new RootState();
export default state;
