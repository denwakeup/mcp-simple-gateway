import dotenv from 'dotenv';

import { createProxyServer } from './createProxyServer';
import { DEFAULT_HOST, DEFAULT_PORT } from './constants';

dotenv.config();

const runServer = () => {
  const proxyServer = createProxyServer({
    configPath: process.env.CONFIG_PATH as string,
  });

  proxyServer.listen(
    process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT,
    process.env.HOST ?? DEFAULT_HOST
  );
};

runServer();
