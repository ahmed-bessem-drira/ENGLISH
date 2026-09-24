import api from './api';

export const answerService = {
  submitAnswer: async (token, data) => {
    const response = await api.post(`/student/session/${token}/answer`, data);
    return response.data;
  },
};