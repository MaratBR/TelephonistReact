import ApiError from './ApiError';
import { AxiosInstance } from 'axios';
import { TFunction } from 'i18next';

export interface ApiBaseOptions {
  client: AxiosInstance;
  t: TFunction;
}

export default abstract class ApiBase {
  readonly client: AxiosInstance;

  protected readonly t: TFunction;

  constructor({ t, client }: ApiBaseOptions) {
    this.client = client;
    this.t = t;
  }

  protected wrapError(err: any) {
    return new ApiError(err, this.t);
  }
}
