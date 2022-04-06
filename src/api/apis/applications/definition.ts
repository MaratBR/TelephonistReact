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

export const APPLICATION_DI_API = Symbol.for('Application API');
export interface IApplicationsApi {
  getAll(params?: PaginationParams<'_id' | 'name'>): Promise<Pagination<Application>>;
  get(id: string): Promise<ApplicationResponse>;
  getByName(name: string): Promise<ApplicationResponse>;
  create(data: CreateApplication): Promise<IdObject>;
  update(id: string, update: UpdateApplication): Promise<Application>;
  checkName(name: string): Promise<boolean>;
  createRegistrationCode(params?: { del_code?: string }): Promise<CodeRegistrationResponse>;
  deleteRegistrationCode(code: string): Promise<void>;
}
