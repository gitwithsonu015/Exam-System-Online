import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResultById } from '../services/resultService';

const ExamResult = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const data = await getResultById(id);
        setResult(data);
      } catch (err) {
        setError(err.message || 'Unable to load result');
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [id]);

  if (loading) {
    return <div className="loading-state">Loading result...</div>;
  }

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  if (!result) {
    return <div className="error-banner">Result not found.</div>;
  }

  return (
    <section className="page-card exam-result-card">
      <div className="result-header">
        <div>
          <h2>Result for {result.examId?.title || 'Exam'}</h2>
          <p className="muted-text">Score: {result.score} / {result.totalMarks}</p>
        </div>
        <Link className="button secondary" to="/results">
          Back to Results
        </Link>
      </div>

      <div className="result-summary">
        <p><strong>Time taken:</strong> {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</p>
        <p><strong>Submitted:</strong> {new Date(result.submittedAt).toLocaleString()}</p>
      </div>

      <div className="question-review">
        {result.questionDetails.map((question, index) => (
          <article key={index} className={`review-card ${question.isCorrect ? 'correct' : 'incorrect'}`}>
            <h3>Q{index + 1}. {question.question}</h3>
            <div className="review-options">
              {question.options.map((option, optionIndex) => {
                const isSelected = optionIndex === question.selectedAnswer;
                const isCorrect = optionIndex === question.correctAnswer;
                return (
                  <div
                    key={optionIndex}
                    className={`review-option ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct-answer' : ''}`}
                  >
                    <span>{String.fromCharCode(65 + optionIndex)}</span>
                    <p>{option}</p>
                  </div>
                );
              })}
            </div>
            <p className="result-badge">
              {question.isCorrect ? 'Correct' : 'Incorrect'}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ExamResult;
