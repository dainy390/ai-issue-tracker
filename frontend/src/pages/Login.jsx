import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = "/"; 
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded-lg w-96 border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to Tracker</h2>
        <input 
          type="email" placeholder="Email Address" 
          className="w-full p-2 mb-4 border rounded focus:outline-blue-500"
          value={email} onChange={(e) => setEmail(e.target.value)} required
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-2 mb-4 border rounded focus:outline-blue-500"
          value={password} onChange={(e) => setPassword(e.target.value)} required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 transition">
          Login
        </button>
        
        {/* Signup Link added here */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}