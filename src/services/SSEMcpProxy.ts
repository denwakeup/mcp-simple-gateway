import { IncomingMessage } from 'http';
import { ServerResponse } from 'http';

import { BaseLogger } from 'pino';
import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';

import { getRPCErrorFromError } from '../helpers';

export interface McpProxyInitParams {
  serverTransport: Transport;
  proxyTransport: SSEServerTransport;
  logger?: BaseLogger;
}

export class SSEMcpProxy {
  private serverTransport: Transport;
  private proxyTransport: SSEServerTransport;
  private logger?: BaseLogger;

  constructor(params: McpProxyInitParams) {
    this.serverTransport = params.serverTransport;
    this.proxyTransport = params.proxyTransport;
    this.logger = params.logger;
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

    this.serverTransport.onerror = async (err) => {
      const rpcError = getRPCErrorFromError(err);

      try {
        await this.proxyTransport.send(rpcError);
      } catch (error) {
        this.logger?.error(error, 'Failed to send error');
      }
    };

    this.proxyTransport.onmessage = async (msg) => {
      try {
        await this.serverTransport.send(msg);
      } catch (error: unknown) {
        const rpcError = getRPCErrorFromError(error);

        await this.proxyTransport.send({
          ...rpcError,
          id: rpcError.id || (msg as { id: string }).id,
        });
      }
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
    await this.serverTransport.close();
    await this.proxyTransport.close();
  };
}
