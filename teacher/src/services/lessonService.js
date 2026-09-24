import api from './api';

export const lessonService = {
  createLesson: async (data) => {
    const response = await api.post('/lessons', data);
    return response.data;
  },

  getLessons: async () => {
    const response = await api.get('/lessons');
    return response.data;
  },

  getLesson: async (id) => {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },

  updateLesson: async (id, data) => {
    const response = await api.patch(`/lessons/${id}`, data);
    return response.data;
  },

  deleteLesson: async (id) => {
    const response = await api.delete(`/lessons/${id}`);
    return response.data;
  },

  generateCode: async (id) => {
    const response = await api.post(`/lessons/${id}/generate-code`);
    return response.data;
  },
};