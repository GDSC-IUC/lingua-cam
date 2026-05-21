import axios from 'axios';

// IMPORTANT: 10.0.2.2 ne marche QUE sur Simulateur. Sur téléphone physique, il faut l'IP du PC !
const LOCAL_IP = '192.168.1.86';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${LOCAL_IP}:5000/api/v1`;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // Timeout de 5s
  headers: {
    'Content-Type': 'application/json',
  },
});

// We can add interceptors here later to automatically inject JWT tokens from AsyncStorage
api.interceptors.request.use(
  async (config) => {
    // const token = await AsyncStorage.getItem('user_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
