import type { Application } from 'express';
import app from './app';
import { initializeCredoAgent, shutdownCredoAgent } from './agent/credoAgent';

const PORT = process.env['PORT'] || 3000;

/** Wraps `server.close()` in a Promise so it can be properly awaited. */
function closeServer(server: ReturnType<Application['listen']>): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function main(): Promise<void> {
  await initializeCredoAgent();

  const server = app.listen(PORT, (): void => {
    console.log(`Business Wallet API server is running on port ${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
  });

  // Graceful shutdown: close HTTP server first, then release Credo resources
  const shutdown = async (): Promise<void> => {
    try {
      await closeServer(server);
      await shutdownCredoAgent();
    } catch (err) {
      console.error('Error during shutdown:', err);
    } finally {
      process.exit(0);
    }
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((err: unknown) => {
  console.error('Failed to start Business Wallet API:', err);
  process.exit(1);
});

export default app;
