import { Request, Response, NextFunction } from 'express';

import { ConfigManager } from '../services';

export const createAuthMiddleware = (configManager: ConfigManager) => {
  return (
    request: Request<{ serverName: string }>,
    response: Response,
    next: NextFunction
  ) => {
    const serverName = request.params.serverName;

    const authTokens = new Set(
      configManager.getMcpServerProxyOptions(serverName)?.authTokens
    );

    if (!authTokens.size) {
      return next();
    }

    const passedToken = request.headers.authorization?.replace(
      /^Bearer\s+/,
      ''
    );

    if (!passedToken || !authTokens.has(passedToken)) {
      response.status(401).send('Not authorized');
      return;
    }

    next();
  };
};
