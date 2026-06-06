import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import {
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService
} from '../services/authService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({ email: '' });
  const [submitting, setSubmitting] = useState(false);

  // Immediate reset UI (after calling forgot-password API)
  const [resetToken, setResetToken] = useState('');
  const [resetForm, setResetForm] = useState({ newPassword: '', confirmPassword: '' });
  const [resetSubmitting, setResetSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await forgotPasswordService({ email: form.email });
      showToast('If your email exists, reset can be done now.', 'success');
      setResetToken(response?.token || '');
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to send reset email';
      showToast(msg, 'error');
      setSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetSubmitting(true);

    try {
      await resetPasswordService({
        token: resetToken,
        newPassword: resetForm.newPassword,
        confirmPassword: resetForm.confirmPassword
      });
      showToast('Password reset successfully. Please login.', 'success');
      navigate('/login');
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to reset password';
      showToast(msg, 'error');
      setResetSubmitting(false);
    }
  };

  return (
    <section className="page-card form-card">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
        </label>
        <button type="submit" className="button primary" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send reset link'}
        </button>
      </form>

      {resetToken ? (
        <section className="page-card form-card" style={{ marginTop: '16px' }}>
          <h2>Set New Password</h2>

          <form onSubmit={handleResetSubmit} className="form-grid">
            <label>
              New Password
              <input
                type="password"
                name="newPassword"
                value={resetForm.newPassword}
                onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
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
                value={resetForm.confirmPassword}
                onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                required
                minLength={6}
                placeholder="Confirm new password"
              />
            </label>

            <button type="submit" className="button primary" disabled={resetSubmitting}>
              {resetSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </section>
      ) : null}

      <p className="muted-text">
        Remembered your password?{' '}
        <span role="button" tabIndex={0} className="linkish" onClick={() => navigate('/login')}>
          Login
        </span>
      </p>
    </section>
  );
};

export default ForgotPassword;

