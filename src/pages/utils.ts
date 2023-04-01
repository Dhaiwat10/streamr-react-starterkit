import { StreamrClient } from 'streamr-client';

export const getNewStreamrClient = (params: { provider?: unknown } = {}) => {
  return new StreamrClient({
    auth: {
      // @ts-expect-error
      ethereum: params.provider || window.ethereum,
    },
  });
};
