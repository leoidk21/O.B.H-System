const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

dotenv.config();
console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET);

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const googleAuth = require('./routes/auth-google');
const pool = require('./db');

const app = express();

// Request logger (MUST be before routes to log API calls)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Request body:", req.body);
  }
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware for API routes
app.use('/api', (req, res, next) => {
  console.log(`API Request: ${req.method} ${req.originalUrl}`);
  console.log("Headers:", req.headers);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
const superAdminRoutes = require('./routes/superAdmin');
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/auth', googleAuth);

const mobileUsers = require("./routes/mobile-users");
app.use("/api", mobileUsers);

// Test endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Serve static files (must be last)
app.use(express.static(path.join(__dirname, '../')));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API server running on:`);
  console.log(`🚀 - Local: http://localhost:${PORT}`);
  console.log(`🚀 - Network: http://192.168.1.7:${PORT}`);
  console.log(`\n📱 For Expo Go, use: http://192.168.1.7:${PORT}/api`);
}); 

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0]);
  }
});