import { UserHubWS } from 'api';
import IApiStatusService from 'api/IApiStatusService';
import { AxiosInstance } from 'axios';
import { action, makeObservable, observable, runInAction } from 'mobx';

export default class WSState {
  readonly hub: UserHubWS;

  private _connectRequests: number = 0;

  isConnected: boolean = false;

  constructor(client: AxiosInstance, statusService: IApiStatusService) {
    this.hub = new UserHubWS(client, statusService);
    this.hub.on('connected', action(this._onConnected.bind(this)));
    this.hub.on('disconnected', action(this._onDisconnected.bind(this)));

    makeObservable(this, {
      isConnected: observable,
    });
  }

  private _onConnected() {
    this.isConnected = true;
  }

  private _onDisconnected() {
    this.isConnected = false;
  }

  async connect() {
    await this.hub.start();
    runInAction(() => {
      this.isConnected = true;
    });
  }

  requestConnect() {
    this._connectRequests += 1;
    if (this._connectRequests === 1) {
      this.connect();
    }
    return this._decrementConnectionRequests.bind(this);
  }

  private _decrementConnectionRequests() {
    this._connectRequests -= 1;
    logging.warn(`_decrementConnectionRequests this._connectRequests=${this._connectRequests}`);
    if (this._connectRequests === 0) {
      setTimeout(() => {
        if (this._connectRequests === 0) {
          this.hub.stop();
        }
      }, 1000);
    }
  }
}
