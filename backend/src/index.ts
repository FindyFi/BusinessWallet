import express, { Request, Response, Application } from 'express';
import { credentialsRouter, employeeVcTypeMetadataHandler } from './routes/credentials';
import { initializeCredoAgent, shutdownCredoAgent } from './agent/credoAgent';

const app: Application = express();
const PORT = process.env['PORT'] || 3000;

app.use(express.json());

app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'business-wallet-api',
    version: '0.1.0'
  });
});

app.use('/credentials', credentialsRouter);
app.get('/.well-known/vct/employee', employeeVcTypeMetadataHandler);

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
