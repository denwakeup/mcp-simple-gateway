import {
  getDefaultEnvironment,
  StdioClientTransport,
} from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

import { isSSEConfig, isStdioConfig } from '../guards';
import { McpServerProxyConfig } from '../types/config';

export const createServerTransport = (serverConfig: McpServerProxyConfig) => {
  if (isSSEConfig(serverConfig)) {
    const url = new URL(serverConfig.url);
    const headers: Record<string, string> = {};

    if (serverConfig.headers) {
      for (const [key, value] of Object.entries(serverConfig.headers)) {
        headers[key] = value;
      }
    }

    return new SSEClientTransport(url, {
      eventSourceInit: {
        fetch: (url, init) =>
          globalThis.fetch(url, {
            ...init,
            headers: {
              ...init?.headers,
              ...headers,
            },
          }),
      },
    });
  }

  if (isStdioConfig(serverConfig)) {
    return new StdioClientTransport({
      command: serverConfig.command,
      args: serverConfig.args,
      env: {
        ...getDefaultEnvironment(),
        ...serverConfig.env,
      },
      cwd: serverConfig.cwd,
    });
  }

  throw new Error('Invalid server config');
};
