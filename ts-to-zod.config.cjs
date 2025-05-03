/**
 * @type {import('ts-to-zod').TsToZodConfig}
 */
const config = [
  {
    name: 'Config',
    input: './src/types/config.ts',
    output: './src/validators/__generated/config.ts',
  },
];

module.exports = config;
