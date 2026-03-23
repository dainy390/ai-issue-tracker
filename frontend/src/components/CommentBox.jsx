import { useState } from "react";
import axios from "axios";

export default function CommentBox({ issueId, onAdd }) {
  const [text, setText] = useState("");

  const submit = async () => {
    const res = await axios.post("/comments", { issueId, commentText: text }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    onAdd(res.data);
    setText("");
  };

  return (
    <div className="mt-4">
      <textarea value={text} onChange={e => setText(e.target.value)} className="border p-2 w-full" />
      <button onClick={submit} className="bg-green-500 text-white px-4 py-2 mt-2 rounded">Add Comment</button>
    </div>
  );
}