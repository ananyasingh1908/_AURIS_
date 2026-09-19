import { createApp } from './app.js';
import { config } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { connectSupabase } from './config/supabase.js';

const startServer = async () => {
  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`AURIS backend listening on port ${config.port}`);
  });

  connectDatabase().catch((err) => {
    console.warn('Database initialization warning:', err.message);
  });

  connectSupabase().catch((err) => {
    console.warn('Supabase initialization warning:', err.message);
  });

  return server;
};

startServer();
