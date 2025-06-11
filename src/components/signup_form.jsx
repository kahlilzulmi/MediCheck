import React, { useState } from "react";
import axios from "axios";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/signup", {
        username,
        password,
      });

      setSuccess("Signup berhasil! Silakan login.");
      setError("");

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error("Signup error:", err.response || err.message || err);
      setError("Gagal daftar. Username mungkin sudah terdaftar.");
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--header-bg)] text-[var(--btn-dark)] px-6"
    style={{
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)),url('https://d3uhejzrzvtlac.cloudfront.net/compro/articleMobile/197_19_ketahui-seputar-manfaat-dan-persiapan-medical-check-up.jpg')",
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}>
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Selamat Datang di{" "}
          <span className="text-black">Medi</span>
          <span className="text-[var(--primary-red)]">Check</span>
        </h1>
        <p className="text-sm text-center mb-8">
          Daftarkan akun Anda untuk mulai memprediksi kondisi kesehatan
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm mb-1 font-medium"
            >
              Nama Pengguna
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Nama Pengguna"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-[var(--primary-red)]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-1 font-medium"
            >
              Kata Sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-[var(--primary-red)]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--primary-red)] text-white font-semibold py-2 rounded-md hover:bg-red-800 transition"
          >
            Daftar
          </button>
        </form>

        {error && (
          <p className="text-yellow-500 mt-4 text-sm text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-500 mt-4 text-sm text-center">{success}</p>
        )}

        <p className="text-xs text-center mt-6 text-gray-600">
          Sudah punya akun?{" "}
          <a href="/" className="underline hover:text-black">
            Masuk di sini
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
