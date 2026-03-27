import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies if used
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // clear token and redirect to login if 401 or 403
            if (typeof window !== 'undefined') {
                localStorage.removeItem('adminToken');
                const lang = window.location.pathname.split('/')[1] || 'en';
                // Only redirect if we are in admin area and not already on login
                if (window.location.pathname.includes('/admin') && !window.location.pathname.includes('/login')) {
                    window.location.href = `/${lang}/admin/login`;
                }
            }
        }
        return Promise.reject(error);
    }
);

// Upload Image Helper
export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data.url;
};

export default api;
