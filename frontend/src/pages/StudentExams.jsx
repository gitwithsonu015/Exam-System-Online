import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudentExams } from '../services/examService';

const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExams = async () => {
      try {
        const data = await getStudentExams();
        setExams(data);
      } catch (err) {
        setError(err.message || 'Unable to load exams');
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading available exams...</div>;
  }

  return (
    <section className="page-card">
      <h2>Available Exams</h2>
      {error && <div className="error-banner">{error}</div>}
      {exams.length === 0 ? (
        <p>No active exams are currently available. Please check back later.</p>
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
                  <span>{exam.isAttempted ? 'Attempted' : 'New'}</span>
                </div>
              </div>
              <div className="card-actions">
                {exam.isAttempted ? (
                  <Link className="button secondary" to="/results">
                    View Results
                  </Link>
                ) : (
                  <Link className="button primary" to={`/exams/${exam._id}/start`}>
                    Start Exam
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default StudentExams;
