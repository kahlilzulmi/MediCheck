import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { jwtDecode } from "jwt-decode";
import api from "../services/api"; // Import the centralized API service

const LoginForm = ({ setIsAuthenticated }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Use the 'api' service, which handles the base URL automatically
      const response = await api.post("/login", {
        username,
        password,
      });

      const token = response.data.access_token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      localStorage.setItem("username", decoded.sub);
      setIsAuthenticated(true); // Update authentication state in App.jsx
      navigate("/"); // Use navigate for client-side routing
    } catch (err) {
      console.error("Error details:", err.response || err.message || err);
      setError("Login gagal, silakan coba lagi.");
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-[var(--header-bg)] text-[var(--btn-dark)]"
      style={{
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)),url('/medicheck.jpg')",
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Form container with backdrop blur and shadow */}
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Selamat Datang di{" "}
          <span className="text-black">Medi</span>
          <span className="text-[var(--primary-red)]">Check</span>
        </h1>
        <p className="text-sm text-center mb-8 text-gray-700">
          Silakan masuk untuk melanjutkan ke dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm mb-1 font-bold text-black">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-[var(--primary-red)]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1 font-bold text-black">
              Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-[var(--primary-red)]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--primary-red)] text-white font-semibold py-2 rounded-md hover:bg-red-800 transition"
          >
            Masuk
          </button>
        </form>

        {error && (
          <p className="text-yellow-400 mt-4 text-center text-sm">{error}</p>
        )}

        <p className="text-xs text-center mt-6 text-gray-600">
          Belum punya akun?{" "}
          <a href="/signup" className="underline hover:text-black">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
