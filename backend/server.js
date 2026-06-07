const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars FIRST
// IMPORTANT: PowerShell/CWD issues can prevent dotenv from loading backend/.env
dotenv.config({ path: require('path').join(__dirname, '.env') });


// Correct DB connector
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://online-exam-system-87fh.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

// Health check route

app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running', status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// helpful debug if env is missing
console.log('Loaded env:', {
  PORT,
  hasMONGODB_URI: !!process.env.MONGODB_URI,
  hasMONGO_URI: !!process.env.MONGO_URI,
});

if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
  console.error('Missing Mongo connection string in backend/.env. Expected MONGODB_URI (or MONGO_URI).');
  process.exit(1);
}

// Connect to database then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});



