import {
  getDefaultEnvironment,
  StdioClientTransport,
} from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';

import { isSSEConfig, isStdioConfig, isStreamableHTTPConfig } from '../guards';
import {
  McpServerProxyConfig,
  McpSSEServerConfig,
  McpStreamableHTTPServerConfig,
} from '../types/config';

const buildHeaders = (
  config: McpSSEServerConfig | McpStreamableHTTPServerConfig
) => {
  const headers: Record<string, string> = {};

  if (config.headers) {
    for (const [key, value] of Object.entries(config.headers)) {
      headers[key] = value;
    }
  }

  return headers;
};

export const createServerTransport = (
  serverConfig: McpServerProxyConfig
): Transport => {
  if (isSSEConfig(serverConfig)) {
    const url = new URL(serverConfig.url);
    const headers = buildHeaders(serverConfig);

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

  if (isStreamableHTTPConfig(serverConfig)) {
    const url = new URL(serverConfig.url);
    const headers = buildHeaders(serverConfig);

    return new StreamableHTTPClientTransport(url, {
      requestInit: {
        headers,
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
