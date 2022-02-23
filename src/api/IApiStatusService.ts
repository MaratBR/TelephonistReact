import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

export const API_STATUS_SERVICE_DI_KEY = Symbol.for('IApiStatusService');
export default interface IApiStatusService {
  isOnline: boolean;
  readonly isOnlineObservable: Observable<boolean>;
  reportOnline(isOnline: boolean): void;
  apiCall<T>(promise: Promise<AxiosResponse<T>>): Promise<T>;
}
