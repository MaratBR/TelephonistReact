import { IApplicationsApi } from './apis/applications';
import { IAuthApi } from './apis/auth';
import { IEventsApi } from './apis/events';
import { ITasksApi } from './apis/tasks';
import { IUsersApi } from './apis/users';
import { TelephonistStats } from './definition';

export default interface IApi {
  readonly events: IEventsApi;

  readonly applications: IApplicationsApi;

  readonly auth: IAuthApi;

  readonly tasks: ITasksApi;

  readonly users: IUsersApi;

  getStats(): Promise<TelephonistStats>;
  issueWsTicket(): Promise<string>;
  checkApi(): Promise<void>;
}
