import { SIZEOF_ID, SIZEOF_SEQUENCE, SIZEOF_SIZE } from "../constants";

export const config = {
  packet: {
    sizeOfSize: SIZEOF_SIZE,
    sizeOfId: SIZEOF_ID,
    sizeOfSequence: SIZEOF_SEQUENCE,
    sizeOfHeader: SIZEOF_SIZE + SIZEOF_ID + SIZEOF_SEQUENCE,
  },
};
