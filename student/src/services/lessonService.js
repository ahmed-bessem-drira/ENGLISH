import api from './api';

export const lessonService = {
  getSession: async (token) => {
    const response = await api.get(`/student/session/${token}`);
    return response.data;
  },

  startSession: async (token) => {
    const response = await api.post(`/student/session/${token}/start`);
    return response.data;
  },

  getCurrentQuestion: async (token) => {
    const response = await api.get(`/student/session/${token}/question`);
    return response.data;
  },

  completeSession: async (token) => {
    const response = await api.post(`/student/session/${token}/complete`);
    return response.data;
  },

  getReview: async (token) => {
    const response = await api.get(`/student/session/${token}/review`);
    return response.data;
  },
};