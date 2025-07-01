import React, { useState } from 'react';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    // No need to navigate here, as the routes will do it automatically
  };

  // A component to wrap protected routes
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      // Redirect them to the /login page
      return <Navigate to="/login" replace />;
    }
    // Pass the onLogout function to the child component
    return React.cloneElement(children, { onLogout: handleLogout });
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes - Home is now at the root path */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/riwayat" element={<ProtectedRoute><Riwayat /></ProtectedRoute>} />
          <Route path="/device" element={<ProtectedRoute><Device /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

          {/* Fallback/Redirect routes */}
          <Route path="/home" element={<Navigate to="/" />} /> {/* Redirect old /home to / */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
