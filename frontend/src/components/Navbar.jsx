import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // Dark mode toggle logic
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-4 flex justify-between items-center shadow-md border-b dark:border-gray-700 transition-colors duration-300">
      <Link to="/" className="text-xl font-bold">IssueTracker AI</Link>
      
      <div className="flex items-center gap-6">
        {/* Dark Mode Toggle Button */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>

        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm text-white transition">
          Logout
        </button>
      </div>
    </nav>
  );
}