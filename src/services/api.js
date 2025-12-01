const API_BASE_URL = 'http://localhost:5000/api';

const apiRequest = async (endpoint, options = {}) => {
    try {
        console.log('API Request:', `${API_BASE_URL}${endpoint}`, options);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include',
            ...options,
        });

        if (!response.ok) {
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            } catch (jsonError) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('API Response:', data);
            return data;
        } else {
            console.log('API Response: Non-JSON or empty response');
            return {};
        }
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

export const authAPI = {
    patientLogin: async (credentials) => {
        return apiRequest('/auth/patient/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    providerLogin: async (credentials) => {
        return apiRequest('/auth/provider/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },
};

export const patientAPI = {
    register: async (patientData) => {
        return apiRequest('/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientData),
        });
    },

    getAll: async (token) => {
        return apiRequest('/patients', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    getById: async (id, token) => {
        return apiRequest(`/patients/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    update: async (id, patientData, token) => {
        return apiRequest(`/patients/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(patientData),
        });
    },

    getHealthData: async (id, token) => {
        return apiRequest(`/patients/${id}/health`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    getHealthHistory: async (id, token) => {
        return apiRequest(`/patients/${id}/health/history`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    updateHealthData: async (id, healthData, token) => {
        console.log('Sending health data update to backend:', id, healthData, token);
        return apiRequest(`/patients/${id}/health`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(healthData),
        });
    },

    delete: async (id, token) => {
        return apiRequest(`/patients/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },
};

export const providerAPI = {
    register: async (providerData) => {
        return apiRequest('/providers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(providerData),
        });
    },

    getAll: async (token) => {
        return apiRequest('/providers', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    getById: async (id, token) => {
        return apiRequest(`/providers/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    update: async (id, providerData, token) => {
        return apiRequest(`/providers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(providerData),
        });
    },

    delete: async (id, token) => {
        return apiRequest(`/providers/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },
};

export default {
    authAPI,
    patientAPI,
    providerAPI,
};