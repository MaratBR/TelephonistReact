export const API_STATUS_SERVICE_DI_KEY = Symbol.for('IApiStatusService');
export default interface IApiStatusService {
  isOnline: boolean;
  reportOnline(isOnline: boolean): void;
}
