import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import SignUp from './pages/signup.jsx';
import Riwayat from './components/riwayat.jsx';
import Device from './components/DeviceManager.jsx';
import Account from './pages/Account.jsx'; // Import the new Account page
import './App.css';

function App() {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  // Optional: Listen for token changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  
  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    // No need to navigate here, as the routes will do it automatically
  };

  // A component to wrap protected routes
  // It now directly renders children and expects onLogout to be passed if needed by the child
  const ProtectedRoute = ({ children, onLogoutProp }) => {
    if (!isAuthenticated) {
      // Redirect them to the /login page
      return <Navigate to="/login" replace />;
    }
    // Pass onLogoutProp directly to the child if it's a React element and expects it
    // This avoids React.cloneElement which can cause re-mounting issues
    if (React.isValidElement(children)) {
      return React.cloneElement(children, { onLogout: onLogoutProp });
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes - Home is now at the root path */}
          {/* Pass handleLogout directly to ProtectedRoute, which then passes it to the child */}
          <Route path="/" element={<ProtectedRoute onLogoutProp={handleLogout}><Home /></ProtectedRoute>} />
          <Route path="/riwayat" element={<ProtectedRoute onLogoutProp={handleLogout}><Riwayat /></ProtectedRoute>} />
          <Route path="/device" element={<ProtectedRoute onLogoutProp={handleLogout}><Device /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute onLogoutProp={handleLogout}><Account /></ProtectedRoute>} />

          {/* Fallback/Redirect routes */}
          <Route path="/home" element={<Navigate to="/" />} /> {/* Redirect old /home to / */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
