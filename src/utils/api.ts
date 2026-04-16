import axios from 'axios';
import { METHOD } from './constants';
import { store } from '../redux/store';

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

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.user.accessToken || localStorage.getItem("access_token");
    const userId = state.user.id || localStorage.getItem("user_id");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['X-Content-Type-Options'] = 'nosniff';
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      config.headers['userId'] = userId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false
let refreshPromise: Promise<string> | null = null

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config

    if (err?.response?.status !== 401) {
      return Promise.reject(err)
    }

    if (originalRequest._retry) {
      return Promise.reject(err)
    }

    originalRequest._retry = true

    try {
      if (!isRefreshing) {
        isRefreshing = true

        refreshPromise = axios.post("http://localhost:3000/auth/refresh", {}, {
          withCredentials: true
        }).then(res => {
          isRefreshing = false
          return res.data.accessToken
        }).catch(e => {
          isRefreshing = false
          throw e
        })
      }

      const newAccessToken = await refreshPromise
      if (newAccessToken) {
        localStorage.setItem("access_token", newAccessToken)
      }

      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      return api(originalRequest)
    } catch (e) {
      return Promise.reject(e)
    }
  }
)
export const request =
  (url: string, method = METHOD.POST) =>
    (data?: any, params = {}) => {
      return api({
        url,
        method,
        params,
        data,
      });
    };
