import { API_DI_KEY, Api } from 'api/Api';
import ApiStatusService from 'api/ApiStatusService';
import { API_STATUS_SERVICE_DI_KEY } from 'api/IApiStatusService';
import { APPLICATION_DI_API } from 'api/apis/applications';
import ApplicationsApi from 'api/apis/applications/implementation';
import { AUTH_API_DI_KEY, AuthApi } from 'api/apis/auth';
import { EVENTS_API_DI_KEY, EventsApi } from 'api/apis/events';
import { TASKS_API_DI_KEY, TasksApi } from 'api/apis/tasks';
import { CLIENT_DI_KEY, getAxiosInstance } from 'api/client';
import { Container } from 'inversify';

function createContainer() {
  const container = new Container();

  container.bind(CLIENT_DI_KEY).toFactory(getAxiosInstance);
  container.bind(API_STATUS_SERVICE_DI_KEY).to(ApiStatusService);
  container.bind(APPLICATION_DI_API).to(ApplicationsApi);
  container.bind(AUTH_API_DI_KEY).to(AuthApi);
  container.bind(TASKS_API_DI_KEY).to(TasksApi);
  container.bind(EVENTS_API_DI_KEY).to(EventsApi);
  container.bind(API_DI_KEY).to(Api);
}

const container = createContainer();

export { container };
