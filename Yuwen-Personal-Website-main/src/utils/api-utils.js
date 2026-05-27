import axios from 'axios';

// Base URLs for the APIs
// Relative paths — resolve against the page's origin. Works both for
// production (https://www.meetyuwen.com/api/...) and local Docker
// (http://localhost/api/...) as long as the nginx gateway proxies
// /api and /springapp.
const API_URLS = {
    fastAPI: '/api',
    springBoot: '/springapp',
};

// Create Axios instances for each base URL
const createAPIInstance = (baseURL) => {
    const api = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor
    api.interceptors.request.use(
        (config) => {
            // Do something before request is sent, like adding auth token
            return config;
        },
        (error) => {
            // Do something with request error
            return Promise.reject(error);
        }
    );

    // Response interceptor
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            // Do something with response error
            console.error('API Error:', error);
            return Promise.reject(error);
        }
    );

    return api;
};

const apiInstances = {
    fastAPI: createAPIInstance(API_URLS.fastAPI),
    springBoot: createAPIInstance(API_URLS.springBoot),
};

export const get = async (url, params = {}, apiName = 'springBoot') => {
    const api = apiInstances[apiName];
    try {
        const response = await api.get(url, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const post = async (url, data, apiName = 'springBoot') => {
    const api = apiInstances[apiName];
    try {
        const response = await api.post(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const put = async (url, data, apiName = 'springBoot') => {
    const api = apiInstances[apiName];
    try {
        const response = await api.put(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const del = async (url, apiName = 'springBoot') => {
    const api = apiInstances[apiName];
    try {
        const response = await api.delete(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const uploadFile = async (url, file, additionalData = {}, apiName = 'springBoot') => {
    const api = apiInstances[apiName];
    const formData = new FormData();
    formData.append('file', file);
    for (const key in additionalData) {
        formData.append(key, additionalData[key]);
    }

    try {
        const response = await api.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
