import {
  Application,
  ApplicationResponse,
  CreateApplication,
  IdObject,
  Pagination,
  PaginationParams,
  UpdateApplication,
} from 'api/definition';

export const APPLICATION_DI_API = Symbol.for('Application API');
export interface IApplicationsApi {
  getApplictions(params?: PaginationParams<'_id' | 'name'>): Promise<Pagination<Application>>;
  getAppliction(id: string): Promise<ApplicationResponse>;
  getApplictionByName(name: string): Promise<ApplicationResponse>;
  createApplication(data: CreateApplication): Promise<IdObject>;
  updateApplication(id: string, update: UpdateApplication): Promise<Application>;
  checkIfApplicationNameTaken(name: string): Promise<boolean>;
}
