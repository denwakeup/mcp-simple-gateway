import { TransportType, McpServerProxyConfig } from '../types/config';

import { isSSEConfig, isStdioConfig, isStreamableHTTPConfig } from './index';

describe('Guard functions', () => {
  describe('isSSEConfig', () => {
    it('should return true for SSE type config', () => {
      const config: McpServerProxyConfig = {
        type: TransportType.SSE,
        url: 'http://example.com',
      };
      expect(isSSEConfig(config)).toBe(true);
    });

    it('should return true for config with url property without type', () => {
      const config: McpServerProxyConfig = {
        url: 'http://example.com',
      };
      expect(isSSEConfig(config)).toBe(true);
    });

    it('should return false for config with url and STREAMABLE_HTTP type', () => {
      const config: McpServerProxyConfig = {
        type: TransportType.STREAMABLE_HTTP,
        url: 'http://example.com',
      };
      expect(isSSEConfig(config)).toBe(false);
    });

    it('should return false for other config types', () => {
      const config: McpServerProxyConfig = {
        type: TransportType.STDIO,
        command: 'test',
        args: [],
      };
      expect(isSSEConfig(config)).toBe(false);
    });
  });

  describe('isStdioConfig', () => {
    it('should return true for STDIO type config', () => {
      const config: McpServerProxyConfig = {
        type: TransportType.STDIO,
        command: 'test',
        args: [],
      };
      expect(isStdioConfig(config)).toBe(true);
    });

    it('should return true for config with command property without type', () => {
      const config: McpServerProxyConfig = {
        command: 'test',
        args: [],
      };
      expect(isStdioConfig(config)).toBe(true);
    });

    it('should return false for other config types', () => {
      const config: McpServerProxyConfig = {
        type: TransportType.SSE,
        url: 'http://example.com',
      };
      expect(isStdioConfig(config)).toBe(false);
    });
  });

  describe('isStreamableHTTPConfig', () => {
    it('should return true for STREAMABLE_HTTP type config', () => {
      const config: McpServerProxyConfig = {
        type: TransportType.STREAMABLE_HTTP,
        url: 'http://example.com',
      };
      expect(isStreamableHTTPConfig(config)).toBe(true);
    });

    it('should return false for other config types', () => {
      const config: McpServerProxyConfig = {
        type: TransportType.SSE,
        url: 'http://example.com',
      };
      expect(isStreamableHTTPConfig(config)).toBe(false);
    });
  });
});
