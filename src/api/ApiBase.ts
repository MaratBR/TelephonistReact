import IApiStatusService from './IApiStatusService';
import { AxiosInstance } from 'axios';

export default abstract class ApiBase {
  protected readonly _client: AxiosInstance;

  readonly statusService: IApiStatusService;

  constructor(client: AxiosInstance, statusService: IApiStatusService) {
    this._client = client;
    this.statusService = statusService;
  }
}
