import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExamById } from '../services/examService';
import { getQuestionsForExam, addQuestion, updateQuestion, deleteQuestion } from '../services/questionService';
import { useToast } from '../context/ToastContext';

const ManageQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form, setForm] = useState({ question: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 });

  const loadExamData = async () => {
    try {
      const [examData, questionData] = await Promise.all([
        getExamById(id),
        getQuestionsForExam(id, { admin: true })
      ]);
      setExam(examData);
      setQuestions(questionData);
    } catch (error) {
      showToast(error.message || 'Unable to load questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExamData();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith('option-')) {
      const index = Number(name.split('-')[1]);
      setForm((prev) => ({
        ...prev,
        options: prev.options.map((option, i) => (i === index ? value : option))
      }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: name === 'correctAnswer' || name === 'marks' ? Number(value) : value
    }));
  };

  const resetForm = () => {
    setEditingQuestion(null);
    setForm({ question: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.options.some((option) => !option.trim())) {
      return showToast('All options are required', 'error');
    }
    if (!form.question.trim()) {
      return showToast('Question text is required', 'error');
    }

    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion._id, form);
        showToast('Question updated', 'success');
      } else {
        await addQuestion({ examId: id, ...form });
        showToast('Question added', 'success');
      }
      await loadExamData();
      resetForm();
    } catch (error) {
      showToast(error.message || 'Unable to save question', 'error');
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setForm({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      marks: question.marks
    });
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Remove this question?')) return;
    try {
      await deleteQuestion(questionId);
      showToast('Question deleted', 'success');
      await loadExamData();
    } catch (error) {
      showToast(error.message || 'Unable to delete question', 'error');
    }
  };

  if (loading) {
    return <div className="loading-state">Loading questions...</div>;
  }

  return (
    <section className="page-card">
      <div className="page-header-row">
        <div>
          <h2>Manage Questions</h2>
          <p className="muted-text">Add, edit, or delete MCQs for the exam.</p>
        </div>
        <button type="button" className="button secondary" onClick={() => navigate('/admin/exams')}>
          Back to Exams
        </button>
      </div>

      <div className="question-management-grid">
        <form onSubmit={handleSubmit} className="question-form form-grid">
          <h3>{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
          <label>
            Question
            <textarea name="question" value={form.question} onChange={handleChange} rows="4" required />
          </label>
          {form.options.map((option, index) => (
            <label key={index}>
              Option {index + 1}
              <input name={`option-${index}`} value={option} onChange={handleChange} required />
            </label>
          ))}
          <label>
            Correct Answer
            <select name="correctAnswer" value={form.correctAnswer} onChange={handleChange}>
              {[0, 1, 2, 3].map((index) => (
                <option key={index} value={index}>
                  Option {index + 1}
                </option>
              ))}
            </select>
          </label>
          <label>
            Marks
            <input name="marks" type="number" min="1" value={form.marks} onChange={handleChange} required />
          </label>
          <div className="button-row">
            <button className="button primary" type="submit">
              {editingQuestion ? 'Update Question' : 'Add Question'}
            </button>
            {editingQuestion && (
              <button type="button" className="button secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="question-list-panel">
          <h3>{exam?.title || 'Exam'} Questions</h3>
          {questions.length === 0 ? (
            <p>No questions defined yet.</p>
          ) : (
            <div className="question-list">
              {questions.map((question) => (
                <article key={question._id} className="question-card">
                  <div>
                    <p>{question.question}</p>
                    <div className="exam-meta">
                      <span>{question.marks} marks</span>
                      <span>Correct: Option {question.correctAnswer + 1}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button type="button" className="button secondary" onClick={() => handleEdit(question)}>
                      Edit
                    </button>
                    <button type="button" className="button danger" onClick={() => handleDelete(question._id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ManageQuestions;
