import axios from 'axios';
import { METHOD } from './constants';
import { supabase } from './supabase';

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
  async (config) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token || localStorage.getItem("access_token");
    const userId = data.session?.user.id || localStorage.getItem("user_id");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['userId'] = userId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
