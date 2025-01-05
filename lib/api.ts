const api = {
    fetch: async (endpoint: string, options = {
        headers: {}
    }) => {
        const defaultHeaders = {
            'Content-Type': 'application/json'
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            },
            credentials: 'include' as RequestCredentials // This is important for sending cookies
        };

        let response = await fetch(`/api${endpoint}`, config);

        // If the response is 401 (Unauthorized), try to refresh the token
        if (response.status === 401) {
            const refreshResponse = await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include'
            });

            if (refreshResponse.ok) {
                // Retry the original request
                response = await fetch(`/api${endpoint}`, config);
            } else {
                // If refresh failed, throw error
                throw new Error('Session expired. Please login again.');
            }
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    },

    post: (endpoint: string, body: {}) => {
        return api.fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    get: (endpoint: string) => {
        return api.fetch(endpoint, {
            method: 'GET'
        });
    }
};

export default api;