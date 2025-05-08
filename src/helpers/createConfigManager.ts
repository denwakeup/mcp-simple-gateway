import fs from 'node:fs';

import { ConfigManager } from '../services';
import { validateConfig } from '../validators';

export const createConfigManager = (configPath: string) => {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found at path: ${configPath}`);
  }

  let configJson: unknown;

  try {
    configJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    throw new Error(`Configuration file contains invalid JSON: ${configPath}`);
  }

  const config = validateConfig(configJson);

  return new ConfigManager(config);
};
