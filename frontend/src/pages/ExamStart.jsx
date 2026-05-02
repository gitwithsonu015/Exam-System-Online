import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExamById } from '../services/examService';

const ExamStart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const data = await getExamById(id);
        setExam(data);
      } catch (err) {
        setError(err.message || 'Unable to load exam');
      } finally {
        setLoading(false);
      }
    };
    loadExam();
  }, [id]);

  if (loading) {
    return <div className="loading-state">Loading exam details...</div>;
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  if (!exam) {
    return <div className="error-banner">Exam not found.</div>;
  }

  return (
    <section className="page-card">
      <h2>{exam.title}</h2>
      <p className="muted-text">Duration: {exam.duration} minutes</p>
      <p>{exam.description || 'This exam has no description.'}</p>
      <ul className="exam-summary">
        <li><strong>Questions:</strong> {exam.questionCount}</li>
        <li><strong>Total marks:</strong> {exam.totalMarks || 'Auto-calculated'}</li>
        <li><strong>Status:</strong> {exam.isActive ? 'Active' : 'Inactive'}</li>
      </ul>
      <button className="button primary" onClick={() => navigate(`/exams/${id}`)}>
        Begin Exam
      </button>
    </section>
  );
};

export default ExamStart;
