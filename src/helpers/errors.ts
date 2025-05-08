import { ErrorCode, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { isJSONRPCError } from '@modelcontextprotocol/sdk/types.js';

export const INTERNAL_PROXY_RPC_ERROR: JSONRPCError = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  id: null,
  jsonrpc: '2.0',
  error: {
    code: ErrorCode.InternalError,
    message: 'Failed to proxy message',
  },
};

export const extractRPCError = (error: unknown): JSONRPCError | null => {
  const stringifyJson = (error as Error)?.message?.match(
    /\{(?:[^{}]|(?:\{[^{}]*\}))*\}/
  )?.[0];

  if (!stringifyJson) {
    return null;
  }

  try {
    const parsedData = JSON.parse(stringifyJson);

    return isJSONRPCError(parsedData) ? parsedData : null;
  } catch {
    return null;
  }
};

export const getRPCErrorFromError = (error: unknown): JSONRPCError => {
  const rpcError = extractRPCError(error);

  return rpcError ?? INTERNAL_PROXY_RPC_ERROR;
};
