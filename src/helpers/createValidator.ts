import { ZodType } from 'zod';
import { fromError } from 'zod-validation-error';

export const createValidator =
  <K>(validator: ZodType<K>) =>
  (data: unknown, errorPrefix?: string) => {
    const result = validator.safeParse(data);

    if (!result.success) {
      throw new Error(
        [errorPrefix, fromError(result.error).toString()]
          .filter(Boolean)
          .join('. ')
      );
    }

    return data as K;
  };
