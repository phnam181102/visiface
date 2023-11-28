import axios from 'axios';
import queryString from 'query-string';

const baseUrl = 'http://localhost:3000/api/v1/';

const axiosClient = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    paramsSerializer: (params) => queryString.stringify({ ...params }),
});

axiosClient.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        if (response?.data) return response.data;

        return response;
    },
    (error) => {
        throw error;
    }
);

export default axiosClient;
