import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { FastifyReply } from 'fastify';
import { BaseLogger } from 'pino';

import { SSEMcpProxy } from '../services/SSEMcpProxy';
import { McpServerProxyConfig } from '../types/config';

import { createServerTransport } from './createServerTransport';

interface Params {
  serverName: string;
  serverConfig: McpServerProxyConfig;
  reply: FastifyReply;
  logger?: BaseLogger;
}

export const createSSEProxy = ({
  serverName,
  serverConfig,
  reply,
  logger,
}: Params) => {
  const serverTransport = createServerTransport(serverConfig);

  const mcpProxy = new SSEMcpProxy({
    logger,
    serverTransport,
    proxyTransport: new SSEServerTransport(`${serverName}/messages`, reply.raw),
  });

  return mcpProxy;
};
