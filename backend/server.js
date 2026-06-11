require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./src/config/db');
const bot = require('./src/bot/index');

// API Routes
const productRoutes = require('./src/routes/products');
const orderRoutes = require('./src/routes/orders');
const dashboardRoutes = require('./src/routes/dashboard');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'BotKart Backend is Running 🚀' });
});

// Mount API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('Owner app connected via socket ✅');
  socket.on('disconnect', () => {
    console.log('Owner app disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

module.exports = { io };