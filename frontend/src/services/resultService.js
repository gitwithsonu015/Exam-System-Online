import api from './api';

export const submitResult = async ({ examId, answers, timeTaken }) => {
  const response = await api.post('/results', { examId, answers, timeTaken });
  return response.data;
};

export const getStudentResults = async () => {
  const response = await api.get('/results/student');
  return response.data;
};

export const getResultById = async (resultId) => {
  const response = await api.get(`/results/${resultId}`);
  return response.data;
};

export const getAllResults = async () => {
  const response = await api.get('/results');
  return response.data;
};

export const getExamResults = async (examId) => {
  const response = await api.get(`/results/exam/${examId}`);
  return response.data;
};
