import api from './api';

export const joinService = {
  joinLesson: async (data) => {
    const response = await api.post('/student/join', data);
    return response.data;
  },
};