import { IncomingMessage } from 'http';
import { ServerResponse } from 'http';

import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export interface McpProxyInitParams {
  serverTransport: StdioClientTransport | SSEClientTransport;
  proxyTransport: SSEServerTransport;
}

export class SSEMcpProxy {
  private serverTransport: StdioClientTransport | SSEClientTransport;
  private proxyTransport: SSEServerTransport;

  constructor(params: McpProxyInitParams) {
    this.serverTransport = params.serverTransport;
    this.proxyTransport = params.proxyTransport;
  }

  get sessionId() {
    return this.proxyTransport.sessionId;
  }

  start = async () => {
    await this.serverTransport.start();
    await this.proxyTransport.start();

    this.serverTransport.onmessage = (msg) => {
      this.proxyTransport.send(msg);
    };

    this.serverTransport.onerror = (err) => {
      this.proxyTransport.send({
        jsonrpc: '2.0',
        error: {
          code: ErrorCode.InternalError,
          message: err.message,
          data: err.stack,
        },
        id: 0,
      });
    };

    this.proxyTransport.onmessage = (msg) => {
      this.serverTransport.send(msg);
    };
  };

  handleMessage = (
    req: IncomingMessage & {
      auth?: AuthInfo;
    },
    res: ServerResponse,
    parsedBody?: unknown
  ) => {
    return this.proxyTransport.handlePostMessage(req, res, parsedBody);
  };

  close = async () => {
    await Promise.all([
      this.serverTransport.close(),
      this.proxyTransport.close(),
    ]);
  };
}
