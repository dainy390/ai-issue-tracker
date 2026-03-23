import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CommentBox from "../components/CommentBox";

export default function IssuePage() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axios.get(`/issues/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setIssue(res.data));

    axios.get(`/comments/issue/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setComments(res.data));

    axios.get(`/issues/${id}/activity`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setActivity(res.data));
  }, [id]);

  const addComment = (c) => setComments([...comments, c]);

  const generateSummary = async () => {
    const res = await axios.post(`/ai/summarize`, { issueId: id }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setSummary(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{issue?.title}</h1>
      <p>{issue?.description}</p>

      <h2 className="mt-4 font-bold">Comments</h2>
      <ul>
        {comments.map(c => (
          <li key={c._id}><strong>{c.userId.name}:</strong> {c.commentText}</li>
        ))}
      </ul>
      <CommentBox issueId={id} onAdd={addComment} />

      <h2 className="mt-4 font-bold">Activity</h2>
      <ul>
        {activity.map(a => (
          <li key={a._id}>{a.userId.name} {a.action} at {new Date(a.timestamp).toLocaleString()}</li>
        ))}
      </ul>

      <button onClick={generateSummary} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Generate AI Summary
      </button>
      {summary && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="font-bold">Summary</h2>
          <p>{summary.summary}</p>
        </div>
      )}
    </div>
  );
}