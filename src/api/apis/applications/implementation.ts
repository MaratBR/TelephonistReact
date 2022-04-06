import { IApplicationsApi } from './definition';
import ApiBase from 'api/ApiBase';
import {
  Application,
  ApplicationResponse,
  CodeRegistrationResponse,
  CreateApplication,
  IdObject,
  Pagination,
  PaginationParams,
  UpdateApplication,
} from 'api/definition';

export default class ApplicationsApi extends ApiBase implements IApplicationsApi {
  createRegistrationCode(params?: { del_code?: string }): Promise<CodeRegistrationResponse> {
    return this.client.post('applications/cr', undefined, { params }).then((r) => r.data);
  }

  async deleteRegistrationCode(code: string): Promise<void> {
    await this.client.delete('applications/cr', { params: { code } });
  }

  getAll(params?: PaginationParams<'_id' | 'name'>): Promise<Pagination<Application>> {
    return this.client.get('applications', { params }).then((r) => r.data);
  }

  get(id: string): Promise<ApplicationResponse> {
    return this.client.get(`applications/${id}`).then((r) => r.data);
  }

  getByName(name: string): Promise<ApplicationResponse> {
    return this.client.get(`applications/name/${name}`).then((r) => r.data);
  }

  update(id: string, update: UpdateApplication) {
    return this.client.patch<Application>(`applications/${id}`, update).then((r) => r.data);
  }

  create(data: CreateApplication): Promise<IdObject> {
    return this.client.post('applications', data).then((r) => r.data);
  }

  checkName(name: string): Promise<boolean> {
    return this.client
      .get('applications/check-if-name-taken', {
        params: { name },
      })
      .then((r) => r.data);
  }
}
