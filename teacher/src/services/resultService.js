import api from './api';

export const resultService = {
  getLessonResults: async (lessonId, classroomId) => {
    const qs = classroomId ? `?classroomId=${classroomId}` : '';
    const response = await api.get(`/lessons/${lessonId}/results${qs}`);
    return response.data;
  },

  getSessionDetails: async (lessonId, sessionId) => {
    const response = await api.get(`/lessons/${lessonId}/results/session/${sessionId}`);
    return response.data;
  },

  reviewAnswer: async (lessonId, answerId, data) => {
    const response = await api.post(`/lessons/${lessonId}/results/answer/${answerId}/review`, data);
    return response.data;
  },

  deleteLessonResults: async (lessonId) => {
    const response = await api.delete(`/lessons/${lessonId}/results`);
    return response.data;
  },
};