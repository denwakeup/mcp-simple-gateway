import { createValidator } from '../helpers/createValidator';

import { configSchema } from './__generated/config';

export const validateConfig = createValidator(configSchema);
