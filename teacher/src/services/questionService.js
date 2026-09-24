import api from './api';

export const questionService = {
  createQuestion: async (data) => {
    const response = await api.post('/questions', data);
    return response.data;
  },

  getQuestionsByLesson: async (lessonId) => {
    const response = await api.get(`/questions/lesson/${lessonId}`);
    return response.data;
  },

  getQuestion: async (id) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  updateQuestion: async (id, data) => {
    const response = await api.patch(`/questions/${id}`, data);
    return response.data;
  },

  deleteQuestion: async (id) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },

  reorderQuestions: async (lessonId, questions) => {
    const response = await api.post(`/questions/lesson/${lessonId}/reorder`, { questions });
    return response.data;
  },
};