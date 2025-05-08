import fs from 'node:fs';

import { jest } from '@jest/globals';

import { createConfigManager } from '../createConfigManager';
import { ConfigManager } from '../../services';

jest.mock('node:fs');
jest.mock('../../services/ConfigManager');

describe('createConfigManager', () => {
  const mockConfigPath = '/path/to/config.json';
  const mockValidConfig = {
    proxyServer: {
      logLevel: 'debug',
      logPretty: true,
      authTokens: ['test-token'],
    },
    mcpServers: {
      testServer: {
        type: 'stdio',
        command: 'test',
        args: ['arg1', 'arg2'],
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create ConfigManager with valid config', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify(mockValidConfig)
    );

    const result = createConfigManager(mockConfigPath);

    expect(fs.existsSync).toHaveBeenCalledWith(mockConfigPath);
    expect(fs.readFileSync).toHaveBeenCalledWith(mockConfigPath, 'utf8');
    expect(ConfigManager).toHaveBeenCalledWith(mockValidConfig);
    expect(result).toBeInstanceOf(ConfigManager);
  });

  it('should throw error if configuration file does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(() => createConfigManager(mockConfigPath)).toThrow(
      `Configuration file not found at path: ${mockConfigPath}`
    );
    expect(fs.readFileSync).not.toHaveBeenCalled();
    expect(ConfigManager).not.toHaveBeenCalled();
  });

  it('should throw error when file contains invalid JSON', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');

    expect(() => createConfigManager(mockConfigPath)).toThrow(
      `Configuration file contains invalid JSON: ${mockConfigPath}`
    );
    expect(ConfigManager).not.toHaveBeenCalled();
  });

  it('should throw error when config has invalid structure', () => {
    const invalidConfig = { invalid: 'config' };

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify(invalidConfig)
    );

    expect(() => createConfigManager(mockConfigPath)).toThrow(
      'Validation error: Required at "proxyServer"'
    );
    expect(ConfigManager).not.toHaveBeenCalled();
  });
});
