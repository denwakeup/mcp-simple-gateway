import {
  McpServerProxyConfig,
  McpSSEServerConfig,
  McpStdioServerConfig,
  McpStreamableHTTPServerConfig,
  TransportType,
} from '../types/config';

export const isSSEConfig = (
  serverConfig: McpServerProxyConfig
): serverConfig is McpSSEServerConfig => {
  return (
    serverConfig.type === TransportType.SSE ||
    ('url' in serverConfig &&
      serverConfig.type !== TransportType.STREAMABLE_HTTP)
  );
};

export const isStdioConfig = (
  serverConfig: McpServerProxyConfig
): serverConfig is McpStdioServerConfig => {
  return serverConfig.type === TransportType.STDIO || 'command' in serverConfig;
};

export const isStreamableHTTPConfig = (
  serverConfig: McpServerProxyConfig
): serverConfig is McpStreamableHTTPServerConfig => {
  return serverConfig.type === TransportType.STREAMABLE_HTTP;
};
