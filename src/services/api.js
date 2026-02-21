import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(config => {
    try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
    } catch (e) {
        console.error('Interceptor error:', e);
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const authApi = {
    login: (credentials) => api.post('/login', credentials),
    getMe: () => api.get('/me')
};

export const publicApi = {
    getIncidents: () => api.get('/public/incidents'),
    getHospitals: () => api.get('/public/hospitals'),
    getVehicles: () => api.get('/public/vehicles')
};

export const resourceApi = {
    // Authenticated resource routes
    getIncidents: () => api.get('/incidents'),
    getHospitals: () => api.get('/hospitals'),
    getVehicles: () => api.get('/vehicles'),
    createIncident: (data) => api.post('/incidents', data),
    updateIncident: (id, data) => api.put(`/incidents/${id}`, data),
    updateVehicle: (id, data) => api.put(`/vehicles/${id}`, data)
};


export default api;
