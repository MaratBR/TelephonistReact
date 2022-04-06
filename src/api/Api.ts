import ApiBase from './ApiBase';
import IApi from './IApi';
import { IApplicationsApi } from './apis/applications';
import ApplicationsApi from './apis/applications/implementation';
import { AuthApi, IAuthApi } from './apis/auth';
import { EventsApi, IEventsApi } from './apis/events';
import { ITasksApi, TasksApi } from './apis/tasks';
import { IUsersApi, UsersApi } from './apis/users';
import { TelephonistStats, WSTicketResponse } from './definition';
import axios from 'axios';
import { TFunction } from 'i18next';

export interface BackendAvailability {
  available: boolean;
  lastError?: any;
  lastErrorCode?: number;
}

export interface ApiOptions {
  baseURL: string;
  csrfToken: string;
  t: TFunction;
  onBackendAvailabilityUpdate?: (availability: BackendAvailability) => void;
}

export class Api extends ApiBase implements IApi {
  readonly events: IEventsApi;

  readonly applications: IApplicationsApi;

  readonly auth: IAuthApi;

  readonly tasks: ITasksApi;

  readonly users: IUsersApi;

  isOnline: boolean = true;

  private _availability: BackendAvailability = { available: true };

  private readonly _availabilityCallback?: (availability: BackendAvailability) => void;

  constructor({ t, csrfToken, onBackendAvailabilityUpdate, baseURL }: ApiOptions) {
    super({
      client: axios.create({
        timeout: 10000,
        headers: csrfToken
          ? {
              'X-CSRF-Token': csrfToken,
            }
          : {},
        baseURL,
        withCredentials: true,
      }),
      t,
    });
    const opts = { client: this.client, t };
    this.client.interceptors.response.use(undefined, this._onError.bind(this));
    this.events = new EventsApi(opts);
    this.applications = new ApplicationsApi(opts);
    this.auth = new AuthApi(opts);
    this.tasks = new TasksApi(opts);
    this.users = new UsersApi(opts);
    this.checkApi();
    this._availabilityCallback = onBackendAvailabilityUpdate;
  }

  getStats(): Promise<TelephonistStats> {
    return this.client.get('status').then((r) => r.data);
  }

  issueWsTicket(): Promise<string> {
    return this.client.get<WSTicketResponse>('ws/issue-ws-ticket').then((d) => d.data.ticket);
  }

  async checkApi() {
    await this.client.get('').catch(() => {});
  }

  private _updateAvailability(availability: Partial<BackendAvailability>) {
    this._availability = {
      ...this._availability,
      ...availability,
    };
    if (this._availabilityCallback) this._availabilityCallback(this._availability);
  }

  private _onError(error: any) {
    if (axios.isAxiosError(error)) {
      if (error.message === 'Network Error') {
        this._updateAvailability({ available: false, lastError: error, lastErrorCode: undefined });
      }

      if (error.response) {
        if (error.response.status === 502) {
          this._updateAvailability({
            available: false,
            lastError: error,
            lastErrorCode: error.response.status,
          });
        } else {
          this._updateAvailability({
            available: true,
            lastError: error,
            lastErrorCode: error.response.status,
          });
        }
      }
    }

    throw this.wrapError(error);
  }
}
