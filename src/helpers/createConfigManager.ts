import fs from 'node:fs';

import { ConfigManager } from '../services';
import { validateConfig } from '../validators';

export const createConfigManager = (configPath: string) => {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found at path: ${configPath}`);
  }

  const configJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const config = validateConfig(configJson);

  return new ConfigManager(config);
};
