import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dataRoutes from './routes/data.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'T-Mobile TruContext Demo API'
  });
});

// API routes
app.use('/api/data', dataRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  T-Mobile TruContext Demo API Server                     ║
║  Status: Running                                          ║
║  Port: ${PORT}                                               ║
║  Environment: ${process.env.NODE_ENV || 'development'}                              ║
║                                                           ║
║  Available Endpoints:                                     ║
║  • GET  /health                                           ║
║  • GET  /api/data/*                                       ║
║  • POST /api/ai/query                                     ║
║  • POST /api/ai/enhance-query                             ║
║                                                           ║
║  Database: PostgreSQL (Neon)                              ║
║  AI: Google Gemini Pro                                    ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
