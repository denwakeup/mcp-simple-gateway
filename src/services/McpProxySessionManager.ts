import { SSEMcpProxy } from './SSEMcpProxy';

interface AddSessionParams {
  serverName: string;
  sessionId: string;
  mcpProxy: SSEMcpProxy;
}

interface RemoveSessionParams {
  serverName: string;
  sessionId: string;
}

interface GetSessionParams {
  serverName: string;
  sessionId: string;
}

export class McpProxySessionManager {
  private sessions = new Map<string, SSEMcpProxy>();

  private generateSessionKey(serverName: string, sessionId: string) {
    return `${serverName}:${sessionId}`;
  }

  addSession = ({ serverName, sessionId, mcpProxy }: AddSessionParams) => {
    this.sessions.set(this.generateSessionKey(serverName, sessionId), mcpProxy);
  };

  removeSession = ({ serverName, sessionId }: RemoveSessionParams) => {
    this.sessions.delete(this.generateSessionKey(serverName, sessionId));
  };

  getSession = ({ serverName, sessionId }: GetSessionParams) => {
    return this.sessions.get(this.generateSessionKey(serverName, sessionId));
  };
}
