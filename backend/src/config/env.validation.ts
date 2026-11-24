export function validateEnv(config: Record<string, unknown>) {
  const port = Number(config.PORT ?? 3000);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer');
  }
  if (!config.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }
  return {
    ...config,
    PORT: port,
    CORS_ORIGIN: config.CORS_ORIGIN ?? 'http://localhost:5173',
  };
}