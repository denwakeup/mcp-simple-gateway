import express from 'express';
import cors from 'cors';

import { McpProxySessionManager } from './services';
import { createSseRoutes } from './routes/sse';
import { createConfigManager } from './helpers/createConfigManager';
import { createLogger } from './helpers';

interface CreateProxyServerParams {
  configPath: string;
}

export const createProxyServer = ({ configPath }: CreateProxyServerParams) => {
  const configManager = createConfigManager(configPath);
  const proxySetting = configManager.getProxySettings();

  const sessionManager = new McpProxySessionManager();
  const logger = createLogger({
    logLevel: proxySetting.logLevel,
    logPretty: proxySetting.logPretty,
  });

  const server = express();

  if (proxySetting.cors) {
    server.use(cors(proxySetting.cors));
  }

  server.use(express.json()).use(
    createSseRoutes({
      configManager,
      sessionManager,
      logger,
    })
  );

  return {
    listen: (port: number, host: string) =>
      server.listen(port, host, (error) => {
        if (error) {
          logger.error(error);
          process.exit(1);
        }

        logger.info(`Server is running on ${host}:${port}`);
      }),
  };
};
