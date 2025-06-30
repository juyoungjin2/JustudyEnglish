//src\utils\axiosConfig.ts
import axios from 'axios';
import axiosRetry from 'axios-retry';
// 필요하면 토큰 가져오는 util 추가
// import { getToken } from './storage';

const instance = axios.create({
  baseURL: 'http://192.168.219.108:3000/api', // 🚨 localhost 대신 에뮬레이터/디바이스에서 접근 가능한 IP로
  timeout: 30000,
});

instance.interceptors.request.use(
  async config => {
    // 예: 토큰이 있으면 헤더에 붙이기
    // const token = await getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      console.warn('인증 오류:', err.response.data);
    }
    return Promise.reject(err);
  }
);

axiosRetry(instance, {
  retries: 3,
  retryDelay: count => count * 1000,
  retryCondition: axiosRetry.isNetworkOrIdempotentRequestError,
});

export default instance;
