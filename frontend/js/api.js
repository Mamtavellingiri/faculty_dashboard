const API_URL = 'http://localhost:5000/api';

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            const data = await response.json();
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Unauthorized, clear token and redirect
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = 'index.html';
                }
                throw new Error(data.message || 'Something went wrong');
            }
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    auth: {
        login: (credentials) => api.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),
        me: () => api.request('/auth/me')
    },

    admin: {
        getFaculties: () => api.request('/admin/faculties'),
        getMetrics: () => api.request('/admin/metrics')
    },

    faculty: {
        getProfile: () => api.request('/faculty/profile'),
        addPerformance: (data) => api.request('/faculty/performance', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }
};
