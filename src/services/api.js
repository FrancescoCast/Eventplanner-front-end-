import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Event APIs
export const eventAPI = {
  getAll: () => api.get('/events'),
  getUpcoming: () => api.get('/events/upcoming'),
  getById: (id) => api.get(`/events/${id}`),
  create: (event) => api.post('/events', event),
  update: (id, event) => api.put(`/events/${id}`, event),
  delete: (id) => api.delete(`/events/${id}`),
};

// Booking APIs
export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  getByEventId: (eventId) => api.get(`/bookings/event/${eventId}`),
  getByEmail: (email) => api.get(`/bookings/user/${email}`),
  create: (booking) => api.post('/bookings', booking),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export default api;