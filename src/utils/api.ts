import axios from 'axios';
import { METHOD } from './constants';

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export const request = (url: string, method = METHOD.POST) => (data: any, params = {}) => {
  const token = sessionStorage.getItem('jwt') || localStorage.getItem('jwt');
  const headers = {
    token,
    'X-Content-Type-Options': 'nosniff',
    'X-Requested-With': 'XMLHttpRequest',
  };
  if (method === METHOD.POST || method === METHOD.PUT) {
    return axios({
      method,
      url: url.replace(/([^:]\/)\/+/g, '$1'),
      params,
      headers,
      data,
    });
  }
  if (method === METHOD.GET) {
    return axios({
      method,
      params,
      url: `${url}${data ? `/${data.join('/')}` : ''}`.replace(
        /([^:]\/)\/+/g,
        '$1',
      ),
      headers,
    });
  }
  if (method === METHOD.PUT) {
    return axios({
      method,
      url: url.replace(/([^:]\/)\/+/g, '$1'),
      params,
      headers,
      data,
    });
  }
  if (method === METHOD.PATCH) {
    return axios({
      method,
      url: url.replace(/([^:]\/)\/+/g, '$1'),
      params,
      headers,
      data,
    });
  }
  if (method === METHOD.DELETE) {
    return axios({
      method,
      url: `${url}`.replace(/([^:]\/)\/+/g, '$1'),
      headers,
    });
  }
  return null;
};
