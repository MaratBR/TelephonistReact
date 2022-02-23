import IApiStatusService from './IApiStatusService';
import axios, { AxiosResponse } from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';

export default class ApiStatusService implements IApiStatusService {
  private _subject = new BehaviorSubject(true);

  private _observable?: Observable<boolean>;

  get isOnline(): boolean {
    return this._subject.value;
  }

  get isOnlineObservable(): Observable<boolean> {
    if (!this._observable) this._observable = this._subject.asObservable();
    return this._observable;
  }

  reportOnline(isOnline: boolean): void {
    if (this.isOnline !== isOnline) this._subject.next(isOnline);
  }

  async apiCall<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
    try {
      const response = await promise;
      this.reportOnline(true);
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.message === 'Network Error') {
        this.reportOnline(false);
      }
      throw e;
    }
  }
}
