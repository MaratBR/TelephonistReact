import { injectable } from "inversify";
import IApiStatusService from "./IApiStatusService";

@injectable()
export default class ApiStatusService implements IApiStatusService {
  isOnline: boolean = true;

  reportOnline(isOnline: boolean): void {
    this.isOnline = isOnline;
  }
}