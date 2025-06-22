// src/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

// 1) create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/ecommerce-service/api/v1',
  withCredentials: true,
});

// 2) request interceptor to attach access token
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// 3) state for one‐at-a-time refresh
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeToken(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

// 4) response interceptor to handle 401
api.interceptors.response.use(
  res => res,
  err => {
    const { response, config } = err;
    const originalRequest = config;
    // if no response / not HTTP or not 401, just bail
    if (!response || (response.status !== 401 && response.status !== 403)) {
      return Promise.reject(err);
    }

    // if we were calling refresh itself, or retried already, logout
    if (
      originalRequest.url.includes('/auth/refresh') ||
      originalRequest._retry
    ) {
      localStorage.removeItem('token');
      window.location.href = '/admin';
      return Promise.reject(err);
    }

    // mark this request to not loop
    originalRequest._retry = true;

    // if a refresh is already in flight, queue this request
    if (isRefreshing) {
      return new Promise(resolve => {
        subscribeToken(newToken => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    // no refresh in flight yet
    isRefreshing = true;

    // kick off refresh
    return new Promise((resolve, reject) => {
      api
        .post('/auth/refresh')
        .then(({ data }) => {
          const newToken = data.token;
          // persist new token
          localStorage.setItem('token', newToken);
          // update default header
          api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          // replay any queued calls
          onRefreshed(newToken);
          // retry original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        })
        .catch(refreshError => {
          // refresh failed: force logout
          localStorage.removeItem('token');
          window.location.href = '/admin';
          reject(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }
);

export default api;
