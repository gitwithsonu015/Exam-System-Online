import api from './api';

export const getStudentExams = async () => {
  const response = await api.get('/exams/student');
  return response.data;
};

export const getExamById = async (examId) => {
  const response = await api.get(`/exams/${examId}`);
  return response.data;
};

export const getExamQuestions = async (examId) => {
  const response = await api.get(`/questions/${examId}?shuffle=true`);
  return response.data;
};

export const getAdminExams = async () => {
  const response = await api.get('/exams');
  return response.data;
};

export const createExam = async (payload) => {
  const response = await api.post('/exams', payload);
  return response.data;
};

export const updateExam = async (examId, payload) => {
  const response = await api.put(`/exams/${examId}`, payload);
  return response.data;
};

export const deleteExam = async (examId) => {
  const response = await api.delete(`/exams/${examId}`);
  return response.data;
};
