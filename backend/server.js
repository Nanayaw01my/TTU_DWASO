require('dotenv').config();
require('express-async-errors');

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const regionRoutes = require('./routes/regions');
const productRoutes = require('./routes/products');
const vendorRoutes = require('./routes/vendors');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const messageRoutes = require('./routes/messages');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Attach io to app for use in controllers
app.set('io', io);

// Connect to MongoDB then auto-seed if regions are missing
connectDB().then(async () => {
  const Region = require('./models/Region');
  const count = await Region.countDocuments();
  if (count === 0) {
    console.log('🌱 No regions found — running auto-seed...');
    const seed = require('./utils/seed');
    await seed(true);
  }
}).catch(() => {});

// Security middleware
app.set('trust proxy', 1); // Render sits behind a proxy
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
      connectSrc: ["'self'", 'https://api.cloudinary.com'],
    },
  },
}));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'TTU DWASO API is running', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // 404 handler for dev
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
}

// Error handler
app.use(errorHandler);

// Socket.io real-time chat
const onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('user_online', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });

  socket.on('send_message', (data) => {
    const recipientSocket = onlineUsers.get(data.recipientId);
    if (recipientSocket) {
      io.to(recipientSocket).emit('receive_message', data);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
      }
    });
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 TTU DWASO Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = { app, server };
