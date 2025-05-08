import {
  CommonProxyOptions,
  Config,
  McpServerConfig,
  McpServerProxyConfig,
  ProxyServerConfig,
} from '../types/config';

export class ConfigManager {
  constructor(private config: Config) {
    this.config = config;
  }

  private getMcpServerProxyConfig(
    serverName: string
  ): McpServerProxyConfig | undefined {
    return this.config.mcpServers[serverName];
  }

  getProxySettings(): ProxyServerConfig {
    return this.config.proxyServer;
  }

  getMcpServers(): Record<string, McpServerConfig> {
    return this.config.mcpServers;
  }

  getMcpServerConfig(serverName: string): McpServerConfig | undefined {
    return this.getMcpServerProxyConfig(serverName);
  }

  getMcpServerProxyOptions(serverName: string): CommonProxyOptions | undefined {
    const specificOptions =
      this.getMcpServerProxyConfig(serverName)?.proxyOptions;

    return specificOptions ?? this.getProxySettings();
  }
}
