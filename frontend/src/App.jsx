import { useContext } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ToastContext } from './context/ToastContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentExams from './pages/StudentExams';
import ExamStart from './pages/ExamStart';
import ExamPage from './pages/ExamPage';
import Results from './pages/Results';
import ExamResult from './pages/ExamResult';
import AdminExams from './pages/AdminExams';
import CreateExam from './pages/CreateExam';
import EditExam from './pages/EditExam';
import ManageQuestions from './pages/ManageQuestions';
import AllResults from './pages/AllResults';
import Analytics from './pages/Analytics';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import './index.css';

function App() {
  const { user, logout } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Online Exam System</div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/register">Register</Link>}
          {user && <Link to="/dashboard">Dashboard</Link>}
          {user && <Link to="/exams">Exams</Link>}
          {user && <Link to="/results">Results</Link>}
          {user && user.role === 'admin' && <Link to="/admin/exams">Admin</Link>}
          {user && (
            <button type="button" className="link-button" onClick={logout}>
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="page-content">
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams"
            element={
              <ProtectedRoute>
                <StudentExams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/:id/start"
            element={
              <ProtectedRoute>
                <ExamStart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/:id"
            element={
              <ProtectedRoute>
                <ExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results/:id"
            element={
              <ProtectedRoute>
                <ExamResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exams"
            element={
              <AdminRoute>
                <AdminExams />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/exams/create"
            element={
              <AdminRoute>
                <CreateExam />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/exams/:id/edit"
            element={
              <AdminRoute>
                <EditExam />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/exams/:id/questions"
            element={
              <AdminRoute>
                <ManageQuestions />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/results"
            element={
              <AdminRoute>
                <AllResults />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <Analytics />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
