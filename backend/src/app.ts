import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.ADMIN_WEB_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get(`${env.API_PREFIX}/health`, (_req, res) => {
    res.status(200).json({
      success: true,
      data: {
        status: 'ok',
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
    });
  });

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Endpoint tidak ditemukan',
      },
    });
  });

  app.use(errorHandler);

  return app;
}
