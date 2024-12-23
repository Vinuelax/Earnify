import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mainRouter from './routes/main.router';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware (if any)
app.use(express.json());
app.use(cors());


// Routes
app.use('', mainRouter);



// Test endpoint
app.get('/ping', (req, res) => {
  res.send('pong');
});


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


// Export the app
export default app;
