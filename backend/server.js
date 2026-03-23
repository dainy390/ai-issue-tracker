const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

connectDB();
app.use(cors());
app.use(express.json());
app.set('socketio', io);

io.on('connection', (socket) => {
  socket.on('join_issue', (issueId) => {
    socket.join(issueId);
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB Connected Successfully`);
});