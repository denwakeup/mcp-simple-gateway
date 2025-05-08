import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';

import { extractRPCError } from '../errors';

describe('extractRPCError', () => {
  it('should extract JSONRPCError from string with JSON', () => {
    const error = new Error(
      'Some error message {"jsonrpc":"2.0","error":{"code":-32603,"message":"Internal error"},"id":1}'
    );
    const result = extractRPCError(error);

    expect(result).toEqual({
      jsonrpc: '2.0',
      error: {
        code: ErrorCode.InternalError,
        message: 'Internal error',
      },
      id: 1,
    });
  });

  it('should return null for error without JSON', () => {
    const error = new Error('Simple error message');
    const result = extractRPCError(error);

    expect(result).toBeNull();
  });

  it('should return null for invalid JSON', () => {
    const error = new Error('Invalid JSON {invalid json}');
    const result = extractRPCError(error);

    expect(result).toBeNull();
  });

  it('should return null for JSON without JSONRPCError structure', () => {
    const error = new Error('{"some": "data"}');
    const result = extractRPCError(error);

    expect(result).toBeNull();
  });
});
