import AuthState from './auth';
import WSState from './ws';
import { Api } from 'api/Api';
import { makeObservable, observable, runInAction } from 'mobx';

export class RootState {
  auth: AuthState;

  ws: WSState;

  api: Api;

  isInitialized: boolean = false;

  constructor() {
    makeObservable(this, {
      isInitialized: observable,
    });

    this.api = new Api();
    this.auth = new AuthState(this.api.auth, this.api.client);
    this.ws = new WSState(this.api.client, this.api.statusService);
  }

  async initialize() {
    await this.auth.initialize();
    runInAction(() => {
      this.isInitialized = true;
    });
  }
}

const state = new RootState();
export default state;
