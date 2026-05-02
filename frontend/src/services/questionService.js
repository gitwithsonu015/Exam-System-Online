import api from './api';

export const getQuestionsForExam = async (examId, options = {}) => {
  const query = options.admin ? '' : '?shuffle=true';
  const response = await api.get(`/questions/${examId}${query}`);
  return response.data;
};

export const addQuestion = async (payload) => {
  const response = await api.post('/questions', payload);
  return response.data;
};

export const updateQuestion = async (questionId, payload) => {
  const response = await api.put(`/questions/${questionId}`, payload);
  return response.data;
};

export const deleteQuestion = async (questionId) => {
  const response = await api.delete(`/questions/${questionId}`);
  return response.data;
};
