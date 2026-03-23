
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function ProjectPage() {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchIssue, setSearchIssue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [issueForm, setIssueForm] = useState({ title: '', description: '', priority: 'Medium' });

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await api.get(`/issues/project/${projectId}`);
        setIssues(res.data);
      } catch (err) {}
    };
    fetchIssues();
  }, [projectId]);

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/issues', { projectId, ...issueForm });
      setIssues([...issues, res.data]);
      setShowModal(false);
      setIssueForm({ title: '', description: '', priority: 'Medium' });
    } catch (err) { alert("Error creating issue"); }
  };

  // Delete Issue
  const handleDeleteIssue = async (e, issueId) => {
    e.preventDefault(); // Prevents navigating to the issue page
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await api.delete(`/issues/${issueId}`);
      setIssues(issues.filter(i => i._id !== issueId));
    } catch (err) { alert("Error deleting issue"); }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = filterStatus === "All" || issue.status === filterStatus;
    const matchesSearch = issue.title.toLowerCase().includes(searchIssue.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Project Issues</h1>
          <button onClick={() => setShowModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">+ Add Issue</button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input type="text" placeholder="Search by title..." className="flex-1 p-2 rounded-lg border dark:bg-gray-800 dark:text-white"
            value={searchIssue} onChange={(e) => setSearchIssue(e.target.value)} />
          <select className="p-2 rounded-lg border dark:bg-gray-800 dark:text-white"
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredIssues.map((issue) => (
            <Link to={`/project/${projectId}/issue/${issue._id}`} key={issue._id}
              className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border hover:border-blue-500">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold dark:text-white">{issue.title}</h3>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 mt-2 inline-block">{issue.priority}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-blue-600">{issue.status}</span>
                  {/* DELETE ISSUE BUTTON ADDED */}
                  <button onClick={(e) => handleDeleteIssue(e, issue._id)} className="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded-md text-sm font-semibold">
                    Delete
                  </button>
                </div>
              </div>
            </Link>
          ))}
          {filteredIssues.length === 0 && <p className="text-center text-gray-500">No issues found.</p>}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Add New Issue</h2>
            <form onSubmit={handleCreateIssue}>
              <input type="text" placeholder="Issue Title" required className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                value={issueForm.title} onChange={(e) => setIssueForm({...issueForm, title: e.target.value})} />
              <textarea placeholder="Description" rows="3" className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                value={issueForm.description} onChange={(e) => setIssueForm({...issueForm, description: e.target.value})} />
              <select className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                value={issueForm.priority} onChange={(e) => setIssueForm({...issueForm, priority: e.target.value})}>
                <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Critical">Critical</option>
              </select>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Add Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}