import express from "express";
import Comment from "../models/comment.js";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

router.post("/summarize/:issueId", async (req, res) => {
  const comments = await Comment.find({ issueId: req.params.issueId });

  const text = comments.map(c => c.commentText).join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: `Summarize:\n${text}` }
    ]
  });

  res.json(response.choices[0].message.content);
});

export default router;