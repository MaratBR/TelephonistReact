import ApiBase from './ApiBase';
import ApiStatusService from './ApiStatusService';
import { IApplicationsApi } from './apis/applications';
import ApplicationsApi from './apis/applications/implementation';
import { AuthApi, IAuthApi } from './apis/auth';
import { EventsApi, IEventsApi } from './apis/events';
import { ITasksApi, TasksApi } from './apis/tasks';
import axios, { AxiosInstance } from 'axios';
import { action, makeObservable, observable } from 'mobx';

export const API_DI_KEY = Symbol.for('API');

export class Api extends ApiBase {
  readonly events: IEventsApi;

  readonly applications: IApplicationsApi;

  readonly auth: IAuthApi;

  readonly tasks: ITasksApi;

  readonly client: AxiosInstance;

  isOnline: boolean = true;

  constructor() {
    super(axios.create(), new ApiStatusService());
    this.client = this._client;
    this.events = new EventsApi(this._client, this.statusService);
    this.applications = new ApplicationsApi(this._client, this.statusService);
    this.auth = new AuthApi(this._client, this.statusService);
    this.tasks = new TasksApi(this._client, this.statusService);

    makeObservable(this, { isOnline: observable });
    this.checkApi();
    this.statusService.isOnlineObservable.subscribe(
      action((v: boolean) => {
        logging.debug(`isOnline = ${v}`);
        this.isOnline = v;
      })
    );
  }

  checkApi() {
    this.statusService.apiCall(this._client.get('')).catch(() => {});
  }
}
