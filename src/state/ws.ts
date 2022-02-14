import { UserHubWS } from 'api';
import { autorun, makeObservable, observable, runInAction } from 'mobx';
import AuthState from './auth';

export class WSState {
  private _client: UserHubWS;

  private _authState: AuthState;

  private _dispose: () => void;

  isConnected: boolean = false;

  lastError: string | null = null;

  get client() {
    return this._client;
  }

  constructor(authState: AuthState) {
    this._authState = authState;
    this._client = new UserHubWS();
    this._dispose = autorun(async () => {
      if (this._authState.isAuthorized) {
        if (!this.isConnected) {
          await this.connect();
        }
      } else if (this.isConnected) {
        await this.disconnect();
      }
    });
    makeObservable(this, {
      isConnected: observable,
      lastError: observable,
    });
  }

  async connect() {
    try {
      await this._client.connect();
      runInAction(() => {
        this.lastError = null;
        this.isConnected = true;
      });
    } catch (e) {
      runInAction(() => {
        this.isConnected = false;
        this.lastError = e.toString();
      });
    }
  }

  async disconnect() {
    this._client.disconnect();
    runInAction(() => {
      this.isConnected = false;
    });
  }

  dispose() {
    this._dispose();
  }
}
