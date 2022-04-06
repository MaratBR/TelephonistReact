import { AxiosResponse } from 'axios';

export default interface IApiStatusService {
  isOnline: boolean;
  isReachable: boolean;
  apiCall<T>(promise: Promise<AxiosResponse<T>>): Promise<T>;
}
