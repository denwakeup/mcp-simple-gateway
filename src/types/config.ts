import { LevelWithSilentOrString } from 'pino';

export interface CommonProxyOptions {
  authTokens?: string[];
}

export interface ProxyServerConfig {
  options?: CommonProxyOptions & {
    logLevel?: LevelWithSilentOrString;
    logPretty?: boolean;
  };
}

export interface McpStdioServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
  cwd?: string;
}

export type McpServerConfig = McpStdioServerConfig | McpSSEServerConfig;

export interface McpSSEServerConfig {
  url: string;
  headers?: Record<string, string>;
}

export interface McpServerProxyBaseConfig {
  proxyOptions?: CommonProxyOptions;
}

export type McpStdioServerProxyConfig = McpServerProxyBaseConfig &
  McpStdioServerConfig;

export type McpSSEServerProxyConfig = McpServerProxyBaseConfig &
  McpSSEServerConfig;

export type McpServerProxyConfig =
  | McpStdioServerProxyConfig
  | McpSSEServerProxyConfig;

export interface Config {
  proxyServer: ProxyServerConfig;
  mcpServers: Record<string, McpServerProxyConfig>;
}
