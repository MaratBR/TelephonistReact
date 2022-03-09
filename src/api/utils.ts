import axios from 'axios';

export function isNotFound(o) {
  return axios.isAxiosError(o) && o.response && o.response.status === 404;
}
