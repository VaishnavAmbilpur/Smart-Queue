const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const queueRoutes = require('./routes/queueRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cookieParser());

app.use(cors({
  origin: "https://smart-queue-theta.vercel.app/",
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/queue', queueRoutes);

const server = http.createServer(app);

// SOCKET IO
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "https://smart-queue-theta.vercel.app/",
    methods: ["GET", "POST","PUT"],
    credentials: true
  }
});


global.io = io;
require("./socket/queueSocket")(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
