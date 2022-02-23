import axios from 'axios';

function normalize(url: string) {
  if (!url.endsWith('/')) return `${url}/`;
  return url;
}

const API_URL = normalize(process.env.API_URL || 'https://localhost:5789/');
const WS_URL = API_URL.replace(/http(s?):\/\//, 'ws$1://');

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.info(
    `%c API URL: %c${API_URL}`,
    'font-weight: bold; font-size: 15px;',
    'font-size: 30px;'
  );
}

axios.defaults.baseURL = API_URL + (API_URL.endsWith('/') ? '' : '/');
axios.defaults.timeout = 15000;
axios.defaults.withCredentials = true;

export { API_URL, WS_URL };
