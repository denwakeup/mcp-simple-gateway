import { FastifyReply } from 'fastify';
import { FastifyAuthFunction } from '@fastify/auth';
import { FastifyRequest } from 'fastify';

import { ConfigManager } from '../services';

interface CreateMcpServerAuthVerifierParams {
  configManager: ConfigManager;
}

type CreateMcpServerAuthVerifierResult = FastifyAuthFunction<
  FastifyRequest<{ Params: { serverName?: string } }>,
  FastifyReply
>;

export const createMcpServerAuthVerifier = ({
  configManager,
}: CreateMcpServerAuthVerifierParams): CreateMcpServerAuthVerifierResult => {
  return (request, _, done) => {
    const { serverName } = request.params;

    if (!serverName) {
      return done(new Error('Incorrect route'));
    }

    const authTokens = new Set(
      configManager.getMcpServerProxyOptions(serverName)?.authTokens
    );

    if (!authTokens.size) {
      return done();
    }

    const passedToken = request.headers.authorization?.replace(
      /^Bearer\s+/,
      ''
    );

    if (!passedToken || !authTokens.has(passedToken)) {
      return done(new Error('Not authorized'));
    }

    done();
  };
};
