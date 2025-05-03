import { createValidator } from '../utils/createValidator';

import { configSchema } from './__generated/config';

export const validateConfig = createValidator(configSchema);
