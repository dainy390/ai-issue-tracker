import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  // Create Project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/projects', { projectName, description });
      setProjects([...projects, res.data]); 
      setShowModal(false); 
      setProjectName("");
      setDescription("");
    } catch (err) {
      alert("Error creating project!");
    }
  };

  // Delete Project
  const handleDeleteProject = async (e, projectId) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this project? All issues inside will also be lost.")) return;
    
    try {
      await api.delete(`/projects/${projectId}`);
    
      setProjects(projects.filter(p => p._id !== projectId));
    } catch (err) {
      alert("Error deleting project. Make sure you are the owner.");
    }
  };

  const filteredProjects = projects.filter(project =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Projects</h1>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input 
                type="text" placeholder="Search projects..."
                className="w-full p-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
            
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition whitespace-nowrap"
            >
              + New Project
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link 
              to={`/project/${project._id}`} key={project._id}
              className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{project.projectName}</h2>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm">{project.description}</p>
                </div>
                
                {/* DELETE PROJECT BUTTON ADDED HERE */}
                <button 
                  onClick={(e) => handleDeleteProject(e, project._id)}
                  className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded-md text-sm font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </Link>
          ))}
          
          {filteredProjects.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 italic">No projects found.</p>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md border dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <input 
                type="text" placeholder="Project Name" required
                className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={projectName} onChange={(e) => setProjectName(e.target.value)}
              />
              <textarea 
                placeholder="Description" required rows="3"
                className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={description} onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded text-gray-800 dark:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}