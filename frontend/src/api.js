// src/api.js
import axios from 'axios';
import { toast } from "react-toastify";
// tell axios to always send cookies
axios.defaults.withCredentials = true;

// attach your access-token header on every request
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");  
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// refresh‐token logic on 401 responses
let isRefreshing = false;
let queue = [];

axios.interceptors.response.use(
  res => res,
  err => {
    const { config, response } = err;
    if (response?.status === 401 && !config._retry) {
      config._retry = true;

      if (isRefreshing) {
        return new Promise(resolve => {
          queue.push(token => {
            config.headers.Authorization = `Bearer ${token}`;
            resolve(axios(config));
          });
        });
      }

                console.log("tesst");
      isRefreshing = true;
      
      return axios.post('http://localhost:8080/api/v1/auth/refresh',{}, { withCredentials: true })  // your refresh endpoint
        .then(({ data }) => {
          const newToken = data.token;

          
          localStorage.setItem('token', newToken);
          queue.forEach(cb => cb(newToken));
          queue = [];
          config.headers.Authorization = `Bearer ${newToken}`;
          return axios(config);
        })
        .catch(() => {
          if(localStorage.getItem('token')&& localStorage.getItem('token') !== ''){
            localStorage.removeItem('token');
            window.location.href = '/login?expired=1';
          }
          return Promise.reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }
    else if (response?.status=== 409){
          localStorage.removeItem('token');
          // window.location.href = '/login?expired=1';
          return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);

export default axios;
