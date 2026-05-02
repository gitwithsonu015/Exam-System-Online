import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllResults } from '../services/resultService';

const AllResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getAllResults();
        setResults(data);
      } catch (err) {
        setError(err.message || 'Unable to load results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <section className="page-card">
      <h2>Student Results</h2>
      {loading ? (
        <div className="loading-state">Loading all results...</div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : results.length === 0 ? (
        <p>No results have been submitted yet.</p>
      ) : (
        <div className="result-grid">
          {results.map((result) => (
            <article key={result._id} className="result-card">
              <h3>{result.examId?.title || 'Exam'}</h3>
              <p className="muted-text">Student: {result.userId?.name || 'Unknown'}</p>
              <div className="result-meta">
                <span>{result.score} / {result.totalMarks}</span>
                <span>{new Date(result.submittedAt).toLocaleDateString()}</span>
              </div>
              <Link className="button secondary" to={`/results/${result._id}`}>
                View Detail
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AllResults;
