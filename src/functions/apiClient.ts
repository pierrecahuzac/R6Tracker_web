import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_BASE_API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

export default apiClient;