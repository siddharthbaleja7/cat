const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
}

export const api = {
    auth: {
        signup: (data) => fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(r => r.json()),
        login: (data) => fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(r => r.json()),
    },

    eventTypes: {
        create: (data) => fetch(`${API_URL}/event-types`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        }).then(r => r.json()),

        getAll: () => fetch(`${API_URL}/event-types`, {
            headers: getHeaders()
        }).then(r => r.json()),

        get: (id) => fetch(`${API_URL}/event-types/${id}`, {
            headers: getHeaders()
        }).then(r => r.json()),

        update: (id, data) => fetch(`${API_URL}/event-types/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        }).then(r => r.json()),

        delete: (id) => fetch(`${API_URL}/event-types/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        }).then(r => r.json()),
    },

    availability: {
        create: (data) => fetch(`${API_URL}/availability`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        }).then(r => r.json()),

        getAll: () => fetch(`${API_URL}/availability`, {
            headers: getHeaders()
        }).then(r => r.json()),

        update: (id, data) => fetch(`${API_URL}/availability/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        }).then(r => r.json()),

        delete: (id) => fetch(`${API_URL}/availability/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        }).then(r => r.json()),
    },

    bookings: {
        create: (data) => fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Public, no token needed
            body: JSON.stringify(data)
        }).then(r => r.json()),

        getAll: () => fetch(`${API_URL}/bookings`, {
            headers: getHeaders()
        }).then(r => r.json()),

        cancel: (id) => fetch(`${API_URL}/bookings/${id}/cancel`, {
            method: 'PATCH',
            headers: getHeaders()
        }).then(r => r.json()),
    },

    public: {
        getEvent: (slug) => fetch(`${API_URL}/public/${slug}`).then(r => r.json()),

        getSlots: (slug, date) => fetch(`${API_URL}/public/${slug}/availability?date=${date}`).then(r => r.json()),
    }
}
