import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

import { isSSEConfig, isStdioConfig } from '../guards';
import { McpServerProxyConfig } from '../types/config';

export const createServerTransport = (serverConfig: McpServerProxyConfig) => {
  if (isSSEConfig(serverConfig)) {
    const url = new URL(serverConfig.url);
    let headers: Headers | undefined;

    if (serverConfig.headers) {
      headers = new Headers();

      Object.entries(serverConfig.headers).forEach(([key, value]) => {
        headers?.set(key, value);
      });
    }

    return new SSEClientTransport(url, {
      requestInit: { headers },
    });
  }

  if (isStdioConfig(serverConfig)) {
    return new StdioClientTransport({
      command: serverConfig.command,
      args: serverConfig.args,
      env: serverConfig.env,
      cwd: serverConfig.cwd,
    });
  }

  throw new Error('Invalid server config');
};
