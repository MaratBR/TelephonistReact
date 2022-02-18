import { CLIENT_DI_KEY } from "api/client";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { inject } from "inversify";
import IApiStatusService, { API_STATUS_SERVICE_DI_KEY } from "./IApiStatusService";

export default abstract class ApiBase {
  protected readonly _client: AxiosInstance;

  private readonly _statusService: IApiStatusService;

  constructor(
    @inject(CLIENT_DI_KEY ) client: AxiosInstance,
    @inject(API_STATUS_SERVICE_DI_KEY) statusService: IApiStatusService
    ) {
    this._client = client;
    this._statusService = statusService;
  }

  protected async _apiCall<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
    try {
      const response = await promise;
      this._statusService.reportOnline(true);
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.message == 'Network Error') {
        this._statusService.reportOnline(false);
      }
      throw e;
    }
  }
}