import { ServerResponse } from 'http';

import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

import { SSEMcpProxy } from '../services/SSEMcpProxy';
import { McpServerProxyConfig } from '../types/config';

import { createServerTransport } from './createServerTransport';

interface Params {
  serverName: string;
  serverConfig: McpServerProxyConfig;
  res: ServerResponse;
}

export const createSSEProxy = ({ serverName, serverConfig, res }: Params) => {
  const serverTransport = createServerTransport(serverConfig);

  const mcpProxy = new SSEMcpProxy({
    serverTransport,
    proxyTransport: new SSEServerTransport(`${serverName}/messages`, res),
  });

  return mcpProxy;
};
