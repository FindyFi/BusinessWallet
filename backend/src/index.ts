import express, { Request, Response, Application, NextFunction } from 'express';
import { credentialsRouter, employeeVcTypeMetadataHandler } from './routes/credentials';
import { initializeCredoAgent, shutdownCredoAgent } from './agent/credoAgent';

const app: Application = express();
const PORT = process.env['PORT'] || 3000;

app.use(express.json());

/**
 * Structured request logging middleware.
 * Logs method, URL, status code, and response time for every request.
 */
app.use((req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(
      JSON.stringify({
        level: 'info',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        status: res.statusCode,
        durationMs: Date.now() - start,
      }),
    );
  });
  next();
});

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

if (require.main === module) {
  app.listen(PORT, (): void => {
    console.log(`Business Wallet API server is running on port ${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
  });
}
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
