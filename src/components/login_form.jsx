import React, { useState } from 'react';
import axios from 'axios';
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/login', {
        username, // Menggunakan username sesuai dengan backend
        password,
      });

      // Simpan token JWT di localStorage
      localStorage.setItem('token', response.data.access_token); // pastikan response sesuai dengan backend

      // Redirect ke halaman utama atau dashboard
      window.location.href = '/home'; // Ganti dengan halaman yang sesuai
    } catch (err) {
      setError('Login failed, please try again');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://source.unsplash.com/random/1920x1080"
          alt=""
          className="w-full h-full object-cover filter blur-lg brightness-50"
        />
      </div>

      {/* Login Form */}
      <div className="relative z-10 bg-white p-8 rounded-md shadow-lg">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="appearance-none border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="appearance-none border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between gap-8">
            <button
              className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-cyan-500 hover:text-cyan-800"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
