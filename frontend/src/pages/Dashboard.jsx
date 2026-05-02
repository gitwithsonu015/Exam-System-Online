import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="page-card">
      <h2>Dashboard</h2>
      <p>Welcome back, <strong>{user?.name}</strong>!</p>
      <div className="dashboard-grid">
        <div className="info-card">
          <h3>Your role</h3>
          <p>{user?.role || 'student'}</p>
        </div>
        <div className="info-card">
          <h3>Your email</h3>
          <p>{user?.email}</p>
        </div>
      </div>
      {user?.role === 'admin' ? (
        <div className="dashboard-card-list">
          <div className="info-card">
            <h3>Admin quick links</h3>
            <ul>
              <li><a href="/admin/exams">Manage Exams</a></li>
              <li><a href="/admin/results">Student Results</a></li>
              <li><a href="/admin/analytics">Analytics</a></li>
            </ul>
          </div>
        </div>
      ) : (
        <p className="muted-text">Choose an exam from the exams page and start your test.</p>
      )}
    </section>
  );
};

export default Dashboard;
