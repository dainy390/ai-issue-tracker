
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../services/api';

const socket = io('http://localhost:5000');

export default function IssuePage() {
  const { issueId } = useParams();
  
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [aiSummary, setAiSummary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const issueRes = await api.get(`/issues/${issueId}`);
        setIssue(issueRes.data);
        const commentRes = await api.get(`/issues/${issueId}/comments`);
        setComments(commentRes.data);
        const logRes = await api.get(`/issues/${issueId}/logs`);
        setLogs(logRes.data);
      } catch (err) {
        console.error("Error fetching issue data:", err);
      }
    };
    fetchAllData();

    socket.emit('join_issue', issueId);
    socket.on('new_comment', (comment) => setComments((prev) => [...prev, comment]));
    socket.on('status_updated', (updatedIssue) => {
      setIssue(updatedIssue);
      refreshLogs();
    });

    return () => {
      socket.off('new_comment');
      socket.off('status_updated');
    };
  }, [issueId]);

  const refreshLogs = async () => {
    try {
      const logRes = await api.get(`/issues/${issueId}/logs`);
      setLogs(logRes.data);
    } catch (err) {}
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/issues/${issueId}/comments`, { commentText: newComment });
      setNewComment(""); 
      refreshLogs();
    } catch (err) { alert("Error posting comment"); }
  };

  // Change Status
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const res = await api.patch(`/issues/${issueId}/status`, { status: newStatus });
      setIssue(res.data);
      refreshLogs();
    } catch (err) {
      alert("Error updating status");
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/issues/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      refreshLogs();
    } catch (err) {
      alert("Error deleting comment. You can only delete your own comments.");
    }
  };

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      const res = await api.post('/ai/summarize', { issueId });
      setAiSummary(res.data);
    } catch (err) {
      alert("Error generating AI Summary.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!issue) return <div className="p-10 text-center dark:text-white">Loading Issue...</div>;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
            <h1 className="text-3xl font-bold mb-2">{issue.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{issue.description}</p>
            
            <div className="flex gap-4 items-center text-sm">
              {/* STATUS DROPDOWN ADDED HERE */}
              <div className="flex items-center gap-2">
                <span className="font-bold">Status:</span>
                <select 
                  value={issue.status} 
                  onChange={handleStatusChange}
                  className="bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700 px-3 py-1 rounded-full font-bold outline-none cursor-pointer"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <span className={`px-3 py-1 rounded-full font-bold ${
                issue.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                Priority: {issue.priority}
              </span>
            </div>
          </div>

          {/* AI Summary Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl shadow-sm border border-indigo-200 dark:border-indigo-900">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-400">✨ AI Discussion Summary</h2>
              <button onClick={generateSummary} disabled={isGenerating || comments.length === 0}
                className={`px-4 py-2 rounded-lg font-bold text-white transition-all ${isGenerating || comments.length === 0 ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {isGenerating ? '⏳ Generating...' : 'Generate AI Summary'}
              </button>
            </div>
            {aiSummary ? (
              <div className="space-y-4 text-sm bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                <p><strong> Summary:</strong> {aiSummary.summary}</p>
                <p><strong> Action Items:</strong> {aiSummary.actionItems}</p>
                <p><strong> Next Steps:</strong> {aiSummary.nextSteps}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Click the button to summarize the discussion.</p>
            )}
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Team Discussion</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {comments.map((c, i) => (
                <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{c.userId?.name || "Member"}</p>
                    {/* DELETE COMMENT BUTTON ADDED */}
                    <button onClick={() => handleDeleteComment(c._id)} className="text-xs text-red-500 hover:text-red-700 font-semibold">
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">{c.commentText}</p>
                </div>
              ))}
            </div>
            <form onSubmit={postComment} className="flex gap-2 mt-4">
              <input className="flex-1 p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Type a comment..." />
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold">Send</button>
            </form>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Activity Timeline</h2>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border dark:border-gray-700 space-y-5">
            {logs.map((log, i) => (
              <div key={i} className="pl-4 border-l-2 border-blue-500 relative">
                <span className="text-sm font-bold">{log.userId?.name || "System"}</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">{log.action}</p>
                <span className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}