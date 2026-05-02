import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminExams, deleteExam } from '../services/examService';

const AdminExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExams = async () => {
      try {
        const data = await getAdminExams();
        setExams(data);
      } catch (err) {
        setError(err.message || 'Could not load exams');
      } finally {
        setLoading(false);
      }
    };
    loadExams();
  }, []);

  const handleDelete = async (examId) => {
    if (!window.confirm('Delete this exam and all related questions/results?')) return;

    try {
      await deleteExam(examId);
      setExams((prev) => prev.filter((exam) => exam._id !== examId));
    } catch (err) {
      setError(err.message || 'Unable to delete exam');
    }
  };

  return (
    <section className="page-card">
      <div className="page-header-row">
        <div>
          <h2>Manage Exams</h2>
          <p className="muted-text">Create, update or remove exams and manage questions.</p>
        </div>
        <Link className="button primary" to="/admin/exams/create">
          Create Exam
        </Link>
      </div>

      {loading ? (
        <div className="loading-state">Loading exams...</div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : exams.length === 0 ? (
        <p>No exams created yet. Add a new exam to get started.</p>
      ) : (
        <div className="exam-grid">
          {exams.map((exam) => (
            <article key={exam._id} className="exam-card">
              <div>
                <h3>{exam.title}</h3>
                <p className="muted-text">{exam.description || 'No description provided.'}</p>
                <div className="exam-meta">
                  <span>{exam.questionCount} questions</span>
                  <span>{exam.duration} min</span>
                  <span>{exam.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="card-actions admin-card-actions">
                <Link className="button secondary" to={`/admin/exams/${exam._id}/questions`}>
                  Questions
                </Link>
                <Link className="button secondary" to={`/admin/exams/${exam._id}/edit`}>
                  Edit
                </Link>
                <button className="button danger" type="button" onClick={() => handleDelete(exam._id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminExams;
