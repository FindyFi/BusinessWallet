import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, (): void => {
  console.log(`Business Wallet API server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

export default app;
