import express from 'express';
import cors from 'cors';
import { middleware } from './middleware/index.js';
import { routes } from './routes/index.js';

// Create Express app
const app = express();

// Core Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', routes.authRoutes);
app.use('/api/teachers', routes.teacherRoutes);
app.use('/api/polls', routes.pollRoutes);

// Error Handling Middleware
app.use(middleware.notFound);
app.use(middleware.errorHandler);

export default app;