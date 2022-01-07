import axios from "axios";
import { AuthState } from "~src/state/auth";

const API_URL = "https://telephonist.lc:5789/";

export function configureAxiosInterceptors(authState: AuthState) {
  axios.interceptors.request.use((config) => {
    if (config.method != "GET" && authState.accessToken) {
      config.headers.Authorization = "Bearer " + authState.accessToken;
    }
    return config;
  });
}

axios.defaults.baseURL = API_URL;
axios.defaults.timeout = 15000;
axios.defaults.withCredentials = true;

export function getAxiosInstance() {
  return axios;
}

export { API_URL };
