import express, { Request, Response, Application } from 'express';
import { credentialsRouter, employeeVcTypeMetadataHandler } from './routes/credentials';
import { initCredoAgent } from './agent/CredoAgent';

const app: Application = express();
const PORT = process.env.PORT || 3000;

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

async function startServer(): Promise<void> {
  console.log('Initialising Credo agent...');
  await initCredoAgent();
  console.log('Credo agent ready.');

  app.listen(PORT, (): void => {
    console.log(`Business Wallet API server is running on port ${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
  });
}

startServer().catch((err: unknown) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
