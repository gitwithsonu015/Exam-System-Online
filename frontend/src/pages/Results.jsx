import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudentResults } from '../services/resultService';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await getStudentResults();
        setResults(data);
      } catch (err) {
        setError(err.message || 'Unable to load results');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading your exam results...</div>;
  }

  return (
    <section className="page-card">
      <h2>My Results</h2>
      {error && <div className="error-banner">{error}</div>}
      {results.length === 0 ? (
        <p>You have not completed any exams yet. Start an exam to see results here.</p>
      ) : (
        <div className="result-grid">
          {results.map((result) => (
            <article key={result._id} className="result-card">
              <h3>{result.examId?.title || 'Exam'}</h3>
              <div className="result-meta">
                <span>Score: {result.score} / {result.totalMarks}</span>
                <span>Date: {new Date(result.submittedAt).toLocaleDateString()}</span>
              </div>
              <Link className="button secondary" to={`/results/${result._id}`}>
                View Details
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Results;
