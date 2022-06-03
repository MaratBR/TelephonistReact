import ApiBase from './ApiBase';
import { api, pagination, rest } from './definition';

export default class ApplicationsApi extends ApiBase implements api.IApplications {
  createRegistrationCode(params?: { del_code?: string }): Promise<rest.CodeRegistrationResponse> {
    return this.client.post('applications/cr', undefined, { params }).then((r) => r.data);
  }

  async deleteRegistrationCode(code: string): Promise<void> {
    await this.client.delete('applications/cr', { params: { code } });
  }

  getAll(
    params?: pagination.Params<'_id' | 'name'>
  ): Promise<pagination.Pagination<rest.Application>> {
    return this.client.get('applications', { params }).then((r) => r.data);
  }

  get(id: string): Promise<rest.ApplicationResponse> {
    return this.client.get(`applications/${id}`).then((r) => r.data);
  }

  async delete(id: string, options?: rest.DeleteApplicationOptions): Promise<void> {
    await this.client.delete(`applications/${id}`, { params: options });
  }

  getByName(name: string): Promise<rest.ApplicationResponse> {
    return this.client.get(`applications/name/${name}`).then((r) => r.data);
  }

  update(id: string, update: rest.UpdateApplication) {
    return this.client.patch<rest.Application>(`applications/${id}`, update).then((r) => r.data);
  }

  create(data: rest.CreateApplication): Promise<rest.IdObject> {
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
