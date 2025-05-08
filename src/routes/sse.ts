import express from 'express';
import { BaseLogger } from 'pino';

import { ConfigManager, McpProxySessionManager } from '../services';
import { createAuthMiddleware, createSSEProxy } from '../helpers';

interface SSEOptions {
  configManager: ConfigManager;
  sessionManager: McpProxySessionManager;
  logger: BaseLogger;
}

export const createSseRoutes = (options: SSEOptions) => {
  const { configManager, sessionManager, logger } = options;

  const router = express.Router();
  const authMiddleware = createAuthMiddleware(configManager);

  router
    .get('/:serverName/sse', authMiddleware, async (request, response) => {
      const serverName = request.params.serverName;
      const serverConfig = configManager.getMcpServerConfig(serverName);

      if (!serverConfig) {
        response.status(404).send('Server not found');
        return;
      }

      const mcpProxy = createSSEProxy({
        serverName,
        serverConfig,
        response,
        logger,
      });

      try {
        await mcpProxy.start();
      } catch (error) {
        await mcpProxy.close();

        logger.error(error, 'Failed to start MCP proxy');

        response.status(500).send('Failed to start MCP proxy');
        return;
      }

      response.on('close', async () => {
        sessionManager.removeSession({
          serverName,
          sessionId: mcpProxy.sessionId,
        });

        await mcpProxy.close();
      });

      sessionManager.addSession({
        serverName,
        sessionId: mcpProxy.sessionId,
        mcpProxy,
      });
    })
    .post(
      '/:serverName/messages',
      authMiddleware,
      async (request, response) => {
        const serverName = request.params.serverName;
        const sessionId = String(request.query.sessionId);
        const mcpProxy = sessionId
          ? sessionManager.getSession({
              serverName,
              sessionId,
            })
          : null;

        if (mcpProxy) {
          await mcpProxy.handleMessage(request, response, request.body);
        } else {
          response.status(400).send('No transport found for sessionId');
        }
      }
    );

  return router;
};
