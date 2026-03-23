# AI-Powered Issue Tracking Platform 🚀

A modern, full-stack Issue Tracking system built with the **MERN Stack**. This platform features real-time team collaboration using **WebSockets** and intelligent discussion summarization powered by **OpenAI**.

---

## ✨ Key Features

### 🛠 Core Functionality (CRUD)
- **Project Management:** Create and delete projects to organize your work.
- **Issue Tracking:** Add tasks/issues with specific priority levels (Low, Medium, High, Critical).
- **Status Updates:** Update issue status (Todo, In Progress, Done) via a dynamic dropdown.
- **Discussion Threads:** Team members can post and delete comments on specific issues.

### ⚡ Real-Time & AI Features
- **Real-Time Updates:** Status changes and new comments reflect instantly for all users using **Socket.io**.
- **Activity Timeline:** Every action (status change, comments) is logged with a timestamp for audit trails.
- **AI Discussion Summary:** Uses **OpenAI (GPT-4)** to analyze long discussions and provide a concise summary, action items, and next steps.

### 🎨 UI/UX
- **Responsive Design:** Built with **Tailwind CSS** for a seamless experience on all devices.
- **Dark Mode Support:** Easy toggle between Light and Dark themes.
- **Search & Filter:** Quickly find projects or issues using the built-in search bar and status filters.

---

## 🏗️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Lucide Icons, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (via Mongoose).
- **Real-Time:** Socket.io.
- **AI Integration:** OpenAI API.
- **Authentication:** JSON Web Tokens (JWT).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed.
- MongoDB Atlas account or local MongoDB.
- OpenAI API Key.

### 2. Installation & Setup

**Clone the repository:**
```bash
git clone [https://github.com/dainy390/ai-issue-tracker.git](https://github.com/dainy390/ai-issue-tracker.git)
cd ai-issue-tracker
