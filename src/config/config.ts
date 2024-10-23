import { CLIENT_VERSION, HOST, PORT } from '../constants/env';
import { SIZEOF_ID, SIZEOF_SIZE } from '../constants/packetHeader';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    sizeOfSize: SIZEOF_SIZE,
    sizeOfId: SIZEOF_ID,
    sizeOfHeader: SIZEOF_SIZE + SIZEOF_ID,
  },
};
