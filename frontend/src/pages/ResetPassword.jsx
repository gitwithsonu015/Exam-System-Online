import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { resetPassword as resetPasswordService } from '../services/authService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const token = searchParams.get('token') || '';

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      showToast('Reset token missing. Please use the link from your email.', 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await resetPasswordService({
        token,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword
      });
      showToast('Password reset successfully. Please login.', 'success');
      navigate('/login');
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to reset password';
      showToast(msg, 'error');
      setSubmitting(false);
    }
  };

  return (
    <section className="page-card form-card">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          New Password
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Enter new password"
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Confirm new password"
          />
        </label>
        <button type="submit" className="button primary" disabled={submitting || !token}>
          {submitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </section>
  );
};

export default ResetPassword;

