import fastify from 'fastify';
import fastifyAuth from '@fastify/auth';

import { McpProxySessionManager } from './services';
import { sseRoutes } from './routes/sse';
import { createConfigManager } from './utils/createConfigManager';
import { DEFAULT_HOST, DEFAULT_PORT } from './constants';
import { createLogger } from './utils';

interface CreateProxyServerParams {
  configPath: string;
  host: string | undefined;
  port: number | undefined;
}

export const createProxyServer = ({
  configPath,
  host = DEFAULT_HOST,
  port = DEFAULT_PORT,
}: CreateProxyServerParams) => {
  const configManager = createConfigManager(configPath);
  const proxySetting = configManager.getProxySettings();

  const sessionManager = new McpProxySessionManager();
  const logger = createLogger({
    logLevel: proxySetting.options?.logLevel,
    logPretty: proxySetting.options?.logPretty,
  });

  const server = fastify({
    loggerInstance: logger,
    disableRequestLogging: true,
  });

  server.register(fastifyAuth).register(sseRoutes, {
    configManager,
    sessionManager,
  });

  return {
    start: async () => {
      try {
        await server.listen({
          port,
          host,
        });
      } catch (error) {
        logger.error(error);

        process.exit(1);
      }
    },
  };
};
