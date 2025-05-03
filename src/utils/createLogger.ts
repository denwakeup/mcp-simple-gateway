import pino from 'pino';

interface CreateLoggerParams {
  logLevel?: string;
  logPretty?: boolean;
}

export const createLogger = ({ logLevel, logPretty }: CreateLoggerParams) => {
  return pino({
    level: logLevel ?? 'info',
    transport: logPretty ? { target: 'pino-pretty' } : undefined,
  });
};
