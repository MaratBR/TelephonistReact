import { AxiosInstance } from 'axios';
import { models, requests } from './apiDef';
import { getAxiosInstance } from './client';

export class Api {
  private readonly _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  // #region auth

  authorize(data: requests.Login): Promise<models.LoginResponse> {
    return this._client.post('auth/token', data).then((r) => r.data);
  }

  async resetPassword(data: requests.ResetPassword) {
    await this._client.post('auth/reset-password', data);
  }

  refreshToken(): Promise<models.LoginResponse> {
    return this._client.post('auth/refresh').then((r) => r.data);
  }

  getUser(): Promise<models.UserView> {
    return this._client.get('auth/user').then((r) => r.data);
  }

  // #endregion

  // #region applications

  getApplictions(
    params?: requests.PaginationParams<'_id' | 'name'>,
  ): Promise<models.Pagination<models.ApplicationView>> {
    return this._client
      .get('user-api/applications', { params })
      .then((r) => r.data);
  }

  getAppliction(id: string): Promise<models.ApplicationResponse> {
    return this._client.get(`user-api/applications/${id}`).then((r) => r.data);
  }

  getApplictionByName(name: string): Promise<models.ApplicationResponse> {
    return this._client
      .get(`user-api/applications/name/${name}`)
      .then((r) => r.data);
  }

  updateApplication(id: string, update: requests.UpdateApplication) {
    return this._client
      .patch<models.ApplicationView>(`user-api/applications/${id}`, update)
      .then((r) => r.data);
  }

  createApplication(data: requests.CreateApplication): Promise<models.IdObject> {
    return this._client.post('user-api/applications', data).then((r) => r.data);
  }

  checkIfApplicationNameTaken(name: string): Promise<boolean> {
    return this._client
      .get('user-api/applications/check-if-name-taken', {
        params: { name },
      })
      .then((r) => r.data);
  }

  // #endregion

  // #region ws

  issueWSTicket(): Promise<string> {
    return this._client.post('user/issue-ws-ticket').then((r) => r.data.ticket);
  }

  // #endregion

  // #region events

  getEvents(
    params: requests.GetEventsParams,
  ): Promise<models.Pagination<models.Event, requests.EventsOrderBy>> {
    return this._client.get('events', { params }).then((r) => r.data);
  }

  getEvent(id: string): Promise<models.Event> {
    return this._client.get(`events/${id}`).then((r) => r.data);
  }

  getSequence(sequenceID: string): Promise<models.Sequence> {
    return this._client
      .get(`events/sequences/${sequenceID}`)
      .then((r) => r.data);
  }

  // #endregion

  // #region application tasks

  getApplicationTask(
    appID: string,
    taskID: string,
  ): Promise<models.ApplicationTask> {
    return this._client
      .get(`user-api/applications/${appID}/defined-tasks/${taskID}`)
      .then((r) => r.data);
  }

  getApplicationTasks(appID: string): Promise<models.ApplicationTask[]> {
    return this._client
      .get(`user-api/applications/${appID}/defined-tasks`)
      .then((r) => r.data);
  }

  defineNewApplicationTask(
    appID: string,
    body: requests.DefineTask,
  ): Promise<models.ApplicationTask> {
    return this._client
      .post(`user-api/applications/${appID}/defined-tasks`, body)
      .then((r) => r.data);
  }

  async deleteApplicationTask(appID: string, taskID: string): Promise<void> {
    await this._client.delete(
      `user-api/applications/${appID}/defined-tasks/${taskID}`,
    );
  }

  updateApplicationTask(
    appID: string,
    taskID: string,
    body: requests.UpdateTask,
  ): Promise<models.ApplicationTask> {
    return this._client
      .patch(`user-api/applications/${appID}/defined-tasks/${taskID}`, body)
      .then((r) => r.data);
  }

  // #endregion
}

const api = new Api(getAxiosInstance());

if (process.env.NODE_ENV === 'development') {
  type _Global = {
    api: Api;
  };
  (window as unknown as _Global).api = api;
}

export default api;
