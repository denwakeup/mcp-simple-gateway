import {
  McpServerProxyConfig,
  McpSSEServerConfig,
  McpStdioServerConfig,
} from '../types/config.js';

export const isSSEConfig = (
  serverConfig: McpServerProxyConfig
): serverConfig is McpSSEServerConfig => {
  return 'url' in serverConfig;
};

export const isStdioConfig = (
  serverConfig: McpServerProxyConfig
): serverConfig is McpStdioServerConfig => {
  return 'command' in serverConfig;
};
