import { IApplicationsApi } from './definition';
import ApiBase from 'api/ApiBase';
import {
  Application,
  ApplicationResponse,
  CreateApplication,
  IdObject,
  Pagination,
  PaginationParams,
  UpdateApplication,
} from 'api/definition';

export default class ApplicationsApi extends ApiBase implements IApplicationsApi {
  getAll(params?: PaginationParams<'_id' | 'name'>): Promise<Pagination<Application>> {
    return this._client.get('user-api/applications', { params }).then((r) => r.data);
  }

  get(id: string): Promise<ApplicationResponse> {
    return this._client.get(`user-api/applications/${id}`).then((r) => r.data);
  }

  getByName(name: string): Promise<ApplicationResponse> {
    return this._client.get(`user-api/applications/name/${name}`).then((r) => r.data);
  }

  update(id: string, update: UpdateApplication) {
    return this._client
      .patch<Application>(`user-api/applications/${id}`, update)
      .then((r) => r.data);
  }

  create(data: CreateApplication): Promise<IdObject> {
    return this._client.post('user-api/applications', data).then((r) => r.data);
  }

  checkName(name: string): Promise<boolean> {
    return this._client
      .get('user-api/applications/check-if-name-taken', {
        params: { name },
      })
      .then((r) => r.data);
  }
}
