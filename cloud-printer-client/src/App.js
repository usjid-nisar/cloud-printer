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
  return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
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
          <PublicRoute>
            <Dashboard />
          </PublicRoute>
        } 
      />
      <Route 
        path="/order-status" 
        element={
          <PublicRoute>
            <OrderStatus />
          </PublicRoute>
        } 
        />

        <Route 
        path="/fulfillment-metrics" 
        element={
          <PublicRoute>
        <FulfillmentMetrics />
        </PublicRoute>
      } 
        />

         <Route 
        path="/settings" 
        element={
          <PublicRoute>
        <Settings />
        </PublicRoute>
      } 
        />
      <Route 
        path="/forwarding-toggle" 
        element={
          <PublicRoute>
        <ForwardingToggle />
        </PublicRoute>
        }
        />
        


        {/* Redirect root to login */}
        {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}

        {/* 404 Route */}
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </Router>
    </OrdersProvider>
  );
}