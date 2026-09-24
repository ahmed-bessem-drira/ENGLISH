import api from './api';

export const classService = {
  getClasses: async () => {
    const response = await api.get('/classrooms');
    return response.data;
  },

  getClass: async (id) => {
    const response = await api.get(`/classrooms/${id}`);
    return response.data;
  },

  createClass: async (data) => {
    const response = await api.post('/classrooms', data);
    return response.data;
  },

  updateClass: async (id, data) => {
    const response = await api.patch(`/classrooms/${id}`, data);
    return response.data;
  },

  deleteClass: async (id) => {
    const response = await api.delete(`/classrooms/${id}`);
    return response.data;
  },

  attachLesson: async (classId, lessonId) => {
    const response = await api.post(`/classrooms/${classId}/lessons`, { lessonId });
    return response.data;
  },

  detachLesson: async (classId, lessonId) => {
    const response = await api.delete(`/classrooms/${classId}/lessons/${lessonId}`);
    return response.data;
  },

  regenerateCode: async (classId, lessonId) => {
    const response = await api.post(`/classrooms/${classId}/lessons/${lessonId}/code`);
    return response.data;
  },
};
