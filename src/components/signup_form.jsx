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

      setSuccess("Signup successful! You can now login.");
      setError("");

      // Redirect ke halaman login setelah 2 detik (opsional)
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error("Signup error:", err.response || err.message || err);
      setError("Signup failed. Username may already exist.");
      setSuccess("");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img
          src="public/medical-stethoscope-white-surface.jpg"
          alt=""
          className="w-full h-full object-cover filter blur-sm brightness-50"
        />
      </div>

      <div className="relative z-10 bg-white p-12 rounded-md shadow-lg ">
        <h1 className="text-xl font-bold mb-4">Sign Up</h1>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="username"
            >
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
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="password"
            >
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
          <button
            className="bg-red-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign Up
          </button>
        </form>
        {error && <p className="text-yellow-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
        <div className="mt-6 text-clip text-xs">
          <p className="text-gray-500">
            Already have an account?{" "}
            <a href="/" className="text-red-500 hover:text-red-700">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
