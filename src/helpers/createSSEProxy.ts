import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { BaseLogger } from 'pino';
import { Response } from 'express';

import { SSEMcpProxy } from '../services/SSEMcpProxy';
import { McpServerProxyConfig } from '../types/config';

import { createServerTransport } from './createServerTransport';

interface Params {
  serverName: string;
  serverConfig: McpServerProxyConfig;
  response: Response;
  logger?: BaseLogger;
}

export const createSSEProxy = ({
  serverName,
  serverConfig,
  response,
  logger,
}: Params) => {
  const serverTransport = createServerTransport(serverConfig);

  const mcpProxy = new SSEMcpProxy({
    logger,
    serverTransport,
    proxyTransport: new SSEServerTransport(`${serverName}/messages`, response),
  });

  return mcpProxy;
};
