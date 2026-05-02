import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="page-card">
      <h1>Welcome to the Online Exam System</h1>
      <p>
        Create exams, attempt tests, and review results all from a single dashboard. Sign in to continue.
      </p>
      <div className="button-row">
        <Link className="button primary" to="/login">
          Login
        </Link>
        <Link className="button secondary" to="/register">
          Register
        </Link>
      </div>
    </section>
  );
};

export default Home;
