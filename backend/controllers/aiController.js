const { OpenAI } = require('openai');
const Comment = require('../models/comment'); // Make sure name matches your model file

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key", 
});

exports.generateSummary = async (req, res) => {
  try {
    const { issueId } = req.body;

    // all comments related to the issue, populated with user info for better AI understanding
    const comments = await Comment.find({ issueId }).populate('userId', 'name');

    if (!comments || comments.length === 0) {
      return res.status(400).json({ message: "No comments available to summarize." });
    }

    // comment send in a readable format for AI
    const conversationText = comments.map(c => `${c.userId?.name || 'User'}: ${c.commentText}`).join('\n');

    // if OpenAI API key is available, call the API to get summary and action items
    if (process.env.OPENAI_API_KEY) {
      const prompt = `
        Analyze the following team discussion from an issue tracking system:
        "${conversationText}"
        
        Provide a JSON response strictly with these keys:
        - "summary": A brief 2 sentence summary of the discussion.
        - "actionItems": A string listing the specific tasks mentioned.
        - "nextSteps": A short string of what should be done next.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

     
      const aiData = JSON.parse(response.choices[0].message.content);
      return res.status(200).json(aiData);
    } 
    
    // . MOCK AI 
    else {
      console.log("No OpenAI API key found. Sending Mock AI Summary for demonstration.");
      
      // Artificial delay 
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      return res.status(200).json({
        summary: "The team discussed the current progress of the issue. Several members provided updates on their assigned tasks and highlighted minor bugs that need fixing.",
        actionItems: "1. Fix the UI styling. 2. Verify backend endpoints. 3. Update database schema.",
        nextSteps: "Review the code changes and merge them into the main branch by end of the day."
      });
    }

  } catch (error) {
    console.error("AI Generation Error:", error.message);
    
    // if OpenAI API call fails, fallback to a generic mock response (taaki user ko feedback mile)
    res.status(200).json({
        summary: "The team is actively collaborating on this issue. Various technical approaches were discussed.",
        actionItems: "Review the latest comments and assign sub-tasks.",
        nextSteps: "Schedule a quick sync-up to finalize the implementation."
    });
  }
};