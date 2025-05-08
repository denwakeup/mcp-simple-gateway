#!/usr/bin/env node
import { Command } from '@commander-js/extra-typings';

import { DEFAULT_HOST, DEFAULT_PORT } from './constants';
import { createProxyServer } from './createProxyServer';

const bootstrap = () => {
  const program = new Command();

  program
    .name('mcp-simple-gateway')
    .description('MCP Simple Gateway')
    .requiredOption('-c, --config <path>', 'Path to the config file')
    .option('-h, --host <host>', 'Host to listen on', DEFAULT_HOST)
    .option('-p, --port <port>', 'Port to listen on', String(DEFAULT_PORT))
    .action((options) => {
      const proxyServer = createProxyServer({
        configPath: options.config,
      });

      proxyServer.listen(Number(options.port), options.host);
    })
    .parse();
};

bootstrap();
