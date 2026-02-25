import express, { type Request, type Response, type Application } from 'express';
import { credentialsRouter, employeeVcTypeMetadataHandler } from './routes/credentials';

const app: Application = express();

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

export default app;
