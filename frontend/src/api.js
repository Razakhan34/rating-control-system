import axios from 'axios';
import { getToken } from './utils/auth';

const API = axios.create({ baseURL: process.env.REACT_APP_API || 'http://localhost:5000/api' });

API.interceptors.request.use(cfg => {
  const t = getToken();
  if(t) cfg.headers.Authorization = 'Bearer ' + t;
  return cfg;
});

API.interceptors.response.use(res => res, err => {
  const data = err.response?.data;
  return Promise.reject({ message: data?.error || err.message, response: err.response });
});

export default API;
