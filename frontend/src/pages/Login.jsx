import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await login(form);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <section className="page-card form-card">
      <h2>Login</h2>
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
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
          />
        </label>
        <button type="submit" className="button primary" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="muted-text">
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </section>
  );
};

export default Login;
