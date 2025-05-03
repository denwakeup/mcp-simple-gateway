import dotenv from 'dotenv';

import { createProxyServer } from './createProxyServer';

dotenv.config();

const runServer = async () => {
  const proxyServer = createProxyServer({
    configPath: process.env.CONFIG_PATH as string,
    host: process.env.HOST,
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  });

  await proxyServer.start();
};

runServer();
