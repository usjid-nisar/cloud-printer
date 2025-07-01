import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import { isAuthenticated } from './services/auth';
import Dashboard from "./pages/Dashboard";


function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <CreateAccount />
            </PublicRoute>
          } 
        />

        {/* Private Routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}