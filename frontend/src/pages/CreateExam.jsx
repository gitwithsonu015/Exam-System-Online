import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExam } from '../services/examService';
import { useToast } from '../context/ToastContext';

const CreateExam = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: 30,
    totalMarks: 0,
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'duration' || name === 'totalMarks' ? Number(value) : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await createExam(form);
      showToast('Exam created successfully', 'success');
      navigate('/admin/exams');
    } catch (error) {
      showToast(error.message || 'Unable to create exam', 'error');
      setSaving(false);
    }
  };

  return (
    <section className="page-card form-card">
      <h2>Create Exam</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} required placeholder="Exam title" />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Optional description" rows="4" />
        </label>
        <label>
          Duration (minutes)
          <input name="duration" type="number" value={form.duration} min="1" onChange={handleChange} required />
        </label>
        <label>
          Total Marks
          <input name="totalMarks" type="number" value={form.totalMarks} min="0" onChange={handleChange} />
        </label>
        <label className="checkbox-field">
          <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} />
          Active exam
        </label>
        <button className="button primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Create Exam'}
        </button>
      </form>
    </section>
  );
};

export default CreateExam;
