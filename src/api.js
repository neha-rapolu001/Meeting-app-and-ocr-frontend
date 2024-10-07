import axios from 'axios';

const BASE_URL = 'http://localhost:8000/';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export const signup = (formData) => api.post('signup/', formData);
export const login = (formData) => api.post('login/', formData);
export const tasks_create = (formData) => api.post('tasks/', formData);
export const tasks_view = () => api.get('tasks/');
export const meeting_create = (formData) => api.post('meeting/', formData);
export const meeting_ocr = (image) => api.post('meeting/ocr', image);
export const meeting_view = () => api.get('meeting/');
export const meeting_read = (pk) => api.get(`meeting/${pk}`);
export const meeting_update = (pk, formData) => api.put(`meeting/${pk}`, formData);
export const person_view = () => api.get('person/');
// export const meeting_delete = (pk) => api.put(`api/meeting//${pk}`);
export const task_view = (id) => api.get(`tasks/${id}`);
export const tasks_delete = (id, formData) => api.delete(`tasks/${id}/`, formData);
export const tasks_update = (id, formData) => api.put(`tasks/${id}/`, formData);
// export const tasks_delete = () => api.post('tasks/');
export const logout = () => api.post('logout/');

