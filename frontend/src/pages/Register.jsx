import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert('Passwords do not match');
    }

    setSubmitting(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <section className="page-card form-card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Full Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your name"
          />
        </label>
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
            placeholder="Create password"
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
            placeholder="Confirm password"
          />
        </label>
        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button type="submit" className="button primary" disabled={submitting}>
          {submitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="muted-text">
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </section>
  );
};

export default Register;
