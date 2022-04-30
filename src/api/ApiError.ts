import axios from 'axios';
import { TFunction } from 'i18next';

export interface FastApiErrorObject {
  loc: string[];
  msg: string;
  type: string;
  ctx: any;
}

export interface ApiErrorObject {
  code: string;
  description: string;
  type: string;
}

export default class ApiError extends Error {
  readonly inner: any;

  private readonly t: TFunction;

  constructor(innerError: any, t: TFunction) {
    super('API error occured');
    this.inner = innerError;
    this.t = t;
  }

  static isFastApiErrorObject(v: any): v is FastApiErrorObject {
    if (typeof v !== 'object' || v === null) return false;
    return (
      typeof v.msg === 'string' &&
      typeof v.type === 'string' &&
      v.loc instanceof Array &&
      v.loc.every((item: any) => typeof item === 'string')
    );
  }

  static isApiErrorObject(v: any): v is ApiErrorObject {
    return (
      typeof v === 'object' &&
      v !== null &&
      typeof v.type === 'string' &&
      typeof v.code === 'string' &&
      (!v.description || typeof v.description === 'string')
    );
  }

  toString() {
    if (axios.isAxiosError(this.inner)) {
      if (this.inner.response) {
        if (this.inner.response.data?.detail) {
          const { detail } = this.inner.response.data;
          if (typeof detail === 'string') {
            return detail;
          }
          if (detail instanceof Array) {
            let s = '';
            for (const err of detail) {
              if (ApiError.isFastApiErrorObject(err)) {
                s += `${err.loc.join(' -> ')} (${err.type}):\n\t${err.msg.replace('\n', '\n\t')}`;
              }
            }
            return s;
          }
          if (
            typeof detail === 'object' &&
            detail !== null &&
            ApiError.isApiErrorObject(detail.error)
          ) {
            const err: ApiErrorObject = detail.error;
            return `${err.type}(${err.code}): ${err.description}`;
          }
          return this.t('errors.generic');
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
