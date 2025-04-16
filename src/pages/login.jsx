import { useState } from 'react';
import axios from 'axios';

const Login = () => {
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
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
