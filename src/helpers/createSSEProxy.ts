import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { FastifyReply } from 'fastify';

import { SSEMcpProxy } from '../services/SSEMcpProxy';
import { McpServerProxyConfig } from '../types/config';

import { createServerTransport } from './createServerTransport';

interface Params {
  serverName: string;
  serverConfig: McpServerProxyConfig;
  reply: FastifyReply;
}

export const createSSEProxy = ({ serverName, serverConfig, reply }: Params) => {
  const serverTransport = createServerTransport(serverConfig);

  const mcpProxy = new SSEMcpProxy({
    serverTransport,
    proxyTransport: new SSEServerTransport(`${serverName}/messages`, reply.raw),
  });

  return mcpProxy;
};
