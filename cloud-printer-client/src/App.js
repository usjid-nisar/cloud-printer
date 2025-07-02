import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import { isAuthenticated } from './services/auth';
import Dashboard from './pages/Dashboard';
import OrderStatus from "./pages/OrderStatus";
import FulfillmentMetrics from "./pages/FulfillmentMetrics";
import { OrdersProvider } from "./context/OrdersContext"
import Settings from './pages/Settings';
import ForwardingToggle from './pages/ForwardingToggle';

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  return !isAuthenticated() ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <OrdersProvider>
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
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/order-status" 
            element={
              <PrivateRoute>
                <OrderStatus />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/fulfillment-metrics" 
            element={
              <PrivateRoute>
                <FulfillmentMetrics />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/forwarding-toggle" 
            element={
              <PrivateRoute>
                <ForwardingToggle />
              </PrivateRoute>
            }
          />

          {/* Redirect root to dashboard if authenticated, otherwise to login */}
          <Route 
            path="/" 
            element={
              isAuthenticated() ? 
                <Navigate to="/" replace /> : 
                <Navigate to="/login" replace />
            } 
          />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </OrdersProvider>
  );
}