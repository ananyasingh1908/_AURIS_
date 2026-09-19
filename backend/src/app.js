import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';
import { apiRouter } from './routes/index.js';

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: config.clientUrl, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'AURIS backend', timestamp: new Date().toISOString() });
  });

  app.use('/api', apiRouter);

  app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  });

  return app;
};
