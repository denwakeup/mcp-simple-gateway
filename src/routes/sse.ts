import { FastifyPluginAsync } from 'fastify';

import { ConfigManager, McpProxySessionManager } from '../services';
import { createMcpServerAuthVerifier, createSSEProxy } from '../helpers';

interface SSEOptions {
  configManager: ConfigManager;
  sessionManager: McpProxySessionManager;
}

interface CommonRouteParams {
  Params: { serverName: string };
}

export const sseRoutes: FastifyPluginAsync<SSEOptions> = async (
  server,
  options
) => {
  const { configManager, sessionManager } = options;

  server
    .addHook(
      'preHandler',
      server.auth([createMcpServerAuthVerifier({ configManager })])
    )
    .route<CommonRouteParams>({
      method: 'GET',
      url: '/:serverName/sse',

      handler: async (request, reply) => {
        const serverName = request.params.serverName;
        const serverConfig = configManager.getMcpServerConfig(serverName);

        if (!serverConfig) {
          return reply.status(404).send('Server not found');
        }

        const mcpProxy = createSSEProxy({
          serverName,
          serverConfig,
          reply,
          logger: request.log,
        });

        try {
          await mcpProxy.start();
        } catch (error) {
          await mcpProxy.close();

          request.log.error(error, 'Failed to start MCP proxy');

          return reply.status(500).send('Failed to start MCP proxy');
        }

        reply.raw.on('close', async () => {
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

        return reply;
      },
    })
    .route<
      CommonRouteParams & {
        Querystring: { sessionId: string };
      }
    >({
      method: 'POST',
      url: '/:serverName/messages',

      handler: async (request, reply) => {
        const serverName = request.params.serverName;
        const sessionId = request.query.sessionId;
        const mcpProxy = sessionManager.getSession({
          serverName,
          sessionId,
        });

        if (mcpProxy) {
          await mcpProxy.handleMessage(request.raw, reply.raw, request.body);

          return reply;
        } else {
          return reply.status(400).send('No transport found for sessionId');
        }
      },
    });
};
