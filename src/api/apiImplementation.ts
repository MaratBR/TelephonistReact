import { models, requests } from "./apiDef";
import { AxiosInstance } from "axios";
import { getAxiosInstance } from "./client";

export class Api {
  private readonly _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  authorize(r: requests.Login): Promise<models.LoginResponse> {
    return this._client.post("auth/token", r).then((r) => r.data);
  }

  refreshToken(): Promise<models.LoginResponse> {
    return this._client.post("auth/refresh").then((r) => r.data);
  }

  getUser(): Promise<models.UserView> {
    return this._client.get("auth/user").then((r) => r.data);
  }

  getApplictions(
    params?: requests.PaginationParams<"_id" | "name">
  ): Promise<models.Pagination<models.ApplicationView>> {
    return this._client.get("applications", { params }).then((r) => r.data);
  }

  getAppliction(id: string): Promise<models.ApplicationResponse> {
    return this._client.get("applications/" + id).then((r) => r.data);
  }

  getApplicationAccessKey(id: string): Promise<string> {
    return this._client
      .get("applications/" + id + "/access-key")
      .then((r) => r.data);
  }

  createApplication(r: requests.CreateApplication): Promise<models.IdObject> {
    return this._client.post("applications", r).then((r) => r.data);
  }
}

const api = new Api(getAxiosInstance());

export default api;
