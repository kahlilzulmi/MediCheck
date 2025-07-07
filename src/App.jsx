
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import SignUp from './pages/signup.jsx';
import Riwayat from './components/riwayat.jsx';
import Device from './components/DeviceManager.jsx';
import Account from './pages/Account.jsx';
import PanduanPengguna from './pages/PanduanPengguna.jsx';
import FAQ from './pages/FAQ.jsx';
import TentangKami from './pages/TentangKami.jsx';
import HubungiKami from './pages/HubungiKami.jsx';
import { UserProvider } from './context/UserContext.jsx';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorage = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children, onLogoutProp }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (React.isValidElement(children)) {
      return React.cloneElement(children, { onLogout: onLogoutProp });
    }
    return children;
  };

  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<ProtectedRoute onLogoutProp={handleLogout}><Home /></ProtectedRoute>} />
            <Route path="/riwayat" element={<ProtectedRoute onLogoutProp={handleLogout}><Riwayat /></ProtectedRoute>} />
            <Route path="/device" element={<ProtectedRoute onLogoutProp={handleLogout}><Device /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute onLogoutProp={handleLogout}><Account /></ProtectedRoute>} />
            <Route path="/panduan-pengguna" element={<ProtectedRoute onLogoutProp={handleLogout}><PanduanPengguna /></ProtectedRoute>} />
            <Route path="/faq" element={<ProtectedRoute onLogoutProp={handleLogout}><FAQ /></ProtectedRoute>} />
            <Route path="/tentang-kami" element={<ProtectedRoute onLogoutProp={handleLogout}><TentangKami /></ProtectedRoute>} />
            <Route path="/hubungi-kami" element={<ProtectedRoute onLogoutProp={handleLogout}><HubungiKami /></ProtectedRoute>} />
            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
