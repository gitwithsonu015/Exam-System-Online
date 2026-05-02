import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExamById, getExamQuestions } from '../services/examService';
import { submitResult } from '../services/resultService';
import { useToast } from '../context/ToastContext';

const ExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const [examData, questionData] = await Promise.all([
          getExamById(id),
          getExamQuestions(id)
        ]);
        setExam(examData);
        setQuestions(questionData);
        setTimeLeft(examData.duration * 60);
      } catch (error) {
        showToast(error.message || 'Unable to load exam', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [id, showToast]);

  useEffect(() => {
    if (loading || questions.length === 0 || timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [loading, questions.length]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [timeLeft]);

  const handleSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async (forceSubmit = false) => {
    if (submitting) return;
    if (!forceSubmit && questions.length > 0 && Object.keys(answers).length < questions.length) {
      showToast('Please answer all questions before submitting.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const answerPayload = questions.map((question) => ({
        questionId: question._id,
        selectedAnswer: answers[question._id] ?? null
      }));

      const result = await submitResult({
        examId: id,
        answers: answerPayload,
        timeTaken: exam.duration * 60 - timeLeft
      });

      navigate(`/results/${result._id}`);
    } catch (error) {
      showToast(error.message || 'Unable to submit exam', 'error');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Preparing exam...</div>;
  }

  if (!exam) {
    return <div className="error-banner">Exam not found.</div>;
  }

  return (
    <section className="page-card exam-page">
      <div className="exam-header">
        <div>
          <h2>{exam.title}</h2>
          <p className="muted-text">Answer all questions within the time limit.</p>
        </div>
        <div className="timer-card">
          <span>Time left</span>
          <strong>{formattedTime}</strong>
        </div>
      </div>

      <div className="question-list">
        {questions.map((question, index) => (
          <div key={question._id} className="question-card">
            <div className="question-heading">
              <span>Q{index + 1}</span>
              <p>{question.question}</p>
            </div>
            <div className="options-grid">
              {question.options.map((option, optionIndex) => {
                const selected = answers[question._id] === optionIndex;
                return (
                  <button
                    key={optionIndex}
                    type="button"
                    className={`option-button ${selected ? 'selected' : ''}`}
                    onClick={() => handleSelect(question._id, optionIndex)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button className="button primary" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Exam'}
      </button>
    </section>
  );
};

export default ExamPage;
