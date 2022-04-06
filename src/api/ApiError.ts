import axios from 'axios';
import { TFunction } from 'i18next';

export default class ApiError extends Error {
  readonly inner: any;

  private readonly t: TFunction;

  constructor(innerError: any, t: TFunction) {
    super('API error occured');
    this.inner = innerError;
    this.t = t;
  }

  toString() {
    if (axios.isAxiosError(this.inner)) {
      if (this.inner.response) {
        if (this.inner.response.data?.detail) {
          return this.inner.response.data.detail;
        }

        if (this.inner.response.status >= 400) {
          return this.t('errors.http.code', { code: this.inner.response.status });
        }

        return this.inner.toString();
      }
    }

    if (this.inner === null || typeof this.inner === 'undefined') return this.t('errors.generic');
    return this.inner.toString();
  }
}
