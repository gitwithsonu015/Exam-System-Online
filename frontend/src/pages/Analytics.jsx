import { useEffect, useMemo, useState } from 'react';
import { getAdminExams } from '../services/examService';
import { getAllResults } from '../services/resultService';

const Analytics = () => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [examData, resultData] = await Promise.all([getAdminExams(), getAllResults()]);
        setExams(examData);
        setResults(resultData);
      } catch (err) {
        setError(err.message || 'Unable to load analytics');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const summary = useMemo(() => {
    const totalExams = exams.length;
    const totalResults = results.length;
    const averageScore = totalResults
      ? (results.reduce((acc, item) => acc + item.score, 0) / totalResults).toFixed(1)
      : 0;
    const students = [...new Set(results.map((item) => item.userId?._id))].length;
    return { totalExams, totalResults, averageScore, students };
  }, [exams, results]);

  return (
    <section className="page-card">
      <h2>Admin Analytics</h2>
      {loading ? (
        <div className="loading-state">Loading analytics...</div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : (
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Total Exams</h3>
            <strong>{summary.totalExams}</strong>
          </div>
          <div className="analytics-card">
            <h3>Students Attempted</h3>
            <strong>{summary.students}</strong>
          </div>
          <div className="analytics-card">
            <h3>Results Submitted</h3>
            <strong>{summary.totalResults}</strong>
          </div>
          <div className="analytics-card">
            <h3>Average Score</h3>
            <strong>{summary.averageScore}</strong>
          </div>
        </div>
      )}
    </section>
  );
};

export default Analytics;
