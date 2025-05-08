import { CorsOptions } from 'cors';
import { LevelWithSilentOrString } from 'pino';

export enum TransportType {
  STDIO = 'stdio',
  SSE = 'sse',
  STREAMABLE_HTTP = 'streamableHttp',
}

export interface CommonProxyOptions {
  authTokens?: string[];
}

export interface ProxyServerConfig extends CommonProxyOptions {
  logLevel?: LevelWithSilentOrString;
  logPretty?: boolean;
  cors?: CorsOptions;
}

export interface McpStdioServerConfig {
  type?: TransportType.STDIO;
  command: string;
  args: string[];
  env?: Record<string, string>;
  cwd?: string;
}

export interface McpSSEServerConfig {
  type?: TransportType.SSE;
  url: string;
  headers?: Record<string, string>;
}

export interface McpStreamableHTTPServerConfig {
  type: TransportType.STREAMABLE_HTTP;
  url: string;
  headers?: Record<string, string>;
}

export type McpServerConfig =
  | McpStdioServerConfig
  | McpSSEServerConfig
  | McpStreamableHTTPServerConfig;

export interface McpServerProxyBaseConfig {
  proxyOptions?: CommonProxyOptions;
}

export type McpStdioServerProxyConfig = McpServerProxyBaseConfig &
  McpStdioServerConfig;

export type McpSSEServerProxyConfig = McpServerProxyBaseConfig &
  McpSSEServerConfig;

export type McpStreamableHTTPServerProxyConfig = McpServerProxyBaseConfig &
  McpStreamableHTTPServerConfig;

export type McpServerProxyConfig =
  | McpStdioServerProxyConfig
  | McpSSEServerProxyConfig
  | McpStreamableHTTPServerProxyConfig;

export interface Config {
  proxyServer: ProxyServerConfig;
  mcpServers: Record<string, McpServerProxyConfig>;
}
