import { useEffect, useMemo, useState } from 'react';
import { getAdminExams } from '../services/examService';
import { getAllResults } from '../services/resultService';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const Analytics = () => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [examData, resultData] = await Promise.all([
          getAdminExams(),
          getAllResults()
        ]);
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

  const analytics = useMemo(() => {
    const totalExams = exams.length;
    const totalResults = results.length;
    const studentIds = new Set(results.map((r) => r?.userId?._id).filter(Boolean));
    const students = studentIds.size;

    const scores = results.map((r) => Number(r?.score ?? 0));
    const totalScoreSum = scores.reduce((acc, s) => acc + s, 0);
    const averageScore = totalResults ? (totalScoreSum / totalResults).toFixed(1) : 0;

    const highestScore = scores.length ? Math.max(...scores) : 0;
    const lowestScore = scores.length ? Math.min(...scores) : 0;

    // Student Performance Graph (simple histogram / score buckets)
    // bucket size is chosen dynamically to keep graph readable
    const minScore = scores.length ? Math.min(...scores) : 0;
    const maxScore = scores.length ? Math.max(...scores) : 0;
    const range = maxScore - minScore;

    let bucketCount = 10;
    if (range <= 0) bucketCount = 1;

    const buckets = Array.from({ length: bucketCount }, (_, i) => {
      const start = minScore + (range * i) / bucketCount;
      const end = minScore + (range * (i + 1)) / bucketCount;
      return { i, start, end, count: 0 };
    });

    for (const s of scores) {
      if (bucketCount === 1) {
        buckets[0].count += 1;
        continue;
      }
      // place into bucket
      const idx = range === 0 ? 0 : Math.floor(((s - minScore) / range) * bucketCount);
      const safeIdx = clamp(idx, 0, bucketCount - 1);
      buckets[safeIdx].count += 1;
    }

    const maxBucket = Math.max(...buckets.map((b) => b.count), 0);

    // Exam Statistics (group results by examId)
    const byExam = new Map();
    for (const r of results) {
      const examId = r?.examId?._id || r?.examId;
      if (!examId) continue;
      if (!byExam.has(examId)) byExam.set(examId, { examId, scores: [] });
      byExam.get(examId).scores.push(Number(r?.score ?? 0));
    }

    const examStats = Array.from(byExam.values())
      .map((entry) => {
        const s = entry.scores;
        const attemptCount = s.length;
        const examAvg = attemptCount ? s.reduce((a, b) => a + b, 0) / attemptCount : 0;
        const examHigh = s.length ? Math.max(...s) : 0;
        const examLow = s.length ? Math.min(...s) : 0;
        const exam = exams.find((e) => String(e?._id) === String(entry.examId));
        return {
          examId: entry.examId,
          title: exam?.title || 'Exam',
          attemptCount,
          averageScore: examAvg.toFixed(1),
          highestScore: examHigh,
          lowestScore: examLow
        };
      })
      .sort((a, b) => b.attemptCount - a.attemptCount);

    return {
      totalExams,
      totalResults,
      students,
      averageScore,
      highestScore,
      lowestScore,
      buckets,
      maxBucket,
      examStats
    };
  }, [exams, results]);

  if (loading) {
    return (
      <section className="page-card">
        <h2>Admin Analytics</h2>
        <div className="loading-state">Loading analytics...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-card">
        <h2>Admin Analytics</h2>
        <div className="error-banner">{error}</div>
      </section>
    );
  }

  return (
    <section className="page-card">
      <h2>Admin Analytics</h2>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Exams</h3>
          <strong>{analytics.totalExams}</strong>
        </div>
        <div className="analytics-card">
          <h3>Students Attempted</h3>
          <strong>{analytics.students}</strong>
        </div>
        <div className="analytics-card">
          <h3>Results Submitted</h3>
          <strong>{analytics.totalResults}</strong>
        </div>
        <div className="analytics-card">
          <h3>Average Score</h3>
          <strong>{analytics.averageScore}</strong>
        </div>
        <div className="analytics-card">
          <h3>Highest Score</h3>
          <strong>{analytics.highestScore}</strong>
        </div>
        <div className="analytics-card">
          <h3>Lowest Score</h3>
          <strong>{analytics.lowestScore}</strong>
        </div>
      </div>

      <div style={{ height: '1.25rem' }} />

      <div className="question-form">
        <h3 style={{ marginTop: 0 }}>Student Performance Graph</h3>
        <p className="muted-text" style={{ marginTop: '-0.5rem' }}>
          Score distribution across all submitted results.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${analytics.buckets.length}, 1fr)`,
            gap: '0.5rem',
            alignItems: 'end',
            minHeight: 180
          }}
        >
          {analytics.buckets.map((b) => {
            const heightPct = analytics.maxBucket
              ? (b.count / analytics.maxBucket) * 100
              : 0;
            const label = `${Math.round(b.start)}-${Math.round(b.end)}`;
            return (
              <div key={b.i} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div
                  title={`${label} : ${b.count} result(s)`}
                  style={{
                    height: `${heightPct}%`,
                    background: 'rgba(37, 99, 235, 0.15)',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: 6,
                    fontWeight: 700,
                    color: '#1d4ed8',
                    userSelect: 'none'
                  }}
                >
                  {b.count}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#4b6aa8', textAlign: 'center' }}>
                  {analytics.buckets.length <= 6 ? label : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: '1.25rem' }} />

      <div className="question-list-panel">
        <div className="page-header-row">
          <h3 style={{ margin: 0 }}>Exam Statistics</h3>
        </div>

        {analytics.examStats.length === 0 ? (
          <p className="muted-text">No exam results available yet.</p>
        ) : (
          <div className="result-grid" style={{ marginTop: '1rem' }}>
            {analytics.examStats.map((s) => (
              <article key={s.examId} className="result-card">
                <h3 style={{ marginTop: 0 }}>{s.title}</h3>
                <div className="result-meta">
                  <span>Attempts: {s.attemptCount}</span>
                  <span>Avg: {s.averageScore}</span>
                  <span>High: {s.highestScore}</span>
                  <span>Low: {s.lowestScore}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Analytics;

