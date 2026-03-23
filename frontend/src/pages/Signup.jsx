import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
    
      await api.post('/auth/signup', formData);
      alert("Signup Successful! Now please login.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup Failed! Check if email already exists.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="p-8 bg-white shadow-md rounded-lg w-96 border-t-4 border-green-500">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <input 
          type="text" placeholder="Full Name" className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setFormData({...formData, name: e.target.value})} required
        />
        <input 
          type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setFormData({...formData, email: e.target.value})} required
        />
        <input 
          type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setFormData({...formData, password: e.target.value})} required
        />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-bold">
          Sign Up
        </button>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}