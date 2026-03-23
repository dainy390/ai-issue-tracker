import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup'; 
import Dashboard from './pages/Dashboard';
import ProjectPage from './pages/ProjectPage';
import IssuePage from './pages/IssuePage';
import Navbar from "./components/Navbar";

export default function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          
          {/* Signup Route added here */}
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
          
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/project/:projectId" element={isAuthenticated ? <ProjectPage /> : <Navigate to="/login" />} />
          <Route path="/project/:projectId/issue/:issueId" element={isAuthenticated ? <IssuePage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}