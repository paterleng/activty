import axios from 'axios';
import { notification } from 'antd';
import {baseURL,path,timeout}  from '../config/config'

const instance = axios.create({
  baseURL: baseURL+path,  
  timeout: timeout,  
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (!token && !config.skipAuth) {
      console.warn('Token 不存在，阻止未授权的请求');
      return Promise.reject({ message: 'Unauthorized: Token is missing' });
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (response.data.code == 200 ) {
        notification.success({
            message: response.data.code,
            description: response.data.msg,
        });
    } else {
       notification.warning({
            message: response.data.code,
            description: response.data.msg,
        });
    }
    return response.data;
  },
  (error) => {
    if (error.response) {
      notification.error({
        message: "错误",
        description: error.response.data.msg,
    });
    } else if (error.request) {
      notification.error({
        message: "错误",
        description: error.response.data.msg,
    });
    } else {
      notification.error({
        message: "错误",
        description: error.response.data.msg,
    });
    }
    return Promise.reject(error);
  }
);

export default instance;
