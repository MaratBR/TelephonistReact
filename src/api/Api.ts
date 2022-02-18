import { inject, injectable } from "inversify";
import { APPLICATION_DI_API, IApplicationsApi } from "./apis/applications";
import { AUTH_API_DI_KEY, IAuthApi } from "./apis/auth";
import { EVENTS_API_DI_KEY, IEventsApi } from "./apis/events";
import { ITasksApi, TASKS_API_DI_KEY } from "./apis/tasks";

export const API_DI_KEY = Symbol.for('API'); 

@injectable()
export class Api {
  @inject(EVENTS_API_DI_KEY) readonly events: IEventsApi;

  @inject(APPLICATION_DI_API) readonly applications: IApplicationsApi;

  @inject(AUTH_API_DI_KEY) readonly auth: IAuthApi;

  @inject(TASKS_API_DI_KEY) readonly tasks: ITasksApi;
}