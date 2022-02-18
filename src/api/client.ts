import axios from 'axios';
import { RootState } from 'state';

const API_URL = process.env.API_URL || 'https://localhost:5789/';
const WS_URL = API_URL.replace(/http(s?):\/\//, 'ws$1://');

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.info(
    `%c API URL: %c${API_URL}`,
    'font-weight: bold; font-size: 15px;',
    'font-size: 30px;'
  );
}

export function configureAxiosInterceptors(rootState: RootState) {
  axios.interceptors.request.use((config) => ({
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${rootState.auth.accessToken}`,
    },
  }));
}

axios.defaults.baseURL = API_URL + (API_URL.endsWith('/') ? '' : '/');
axios.defaults.timeout = 15000;
axios.defaults.withCredentials = true;

export function getAxiosInstance() {
  return axios;
}

const CLIENT_DI_KEY = Symbol.for('axios client');

export { API_URL, WS_URL, CLIENT_DI_KEY };
