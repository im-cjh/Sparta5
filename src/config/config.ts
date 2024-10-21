import { CLIENT_VERSION, HOST, PORT } from '../constants/env';
import { SIZEOF_TOTAL_LENGTH, SIZEOF_TYPE_LENGTH } from '../constants/header';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    sizeOfTotalLength: SIZEOF_TOTAL_LENGTH,
    sizeOfTypeLength: SIZEOF_TYPE_LENGTH,
  },
};
