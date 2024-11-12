const SIZEOF_SIZE: number = 2;
const SIZEOF_ID: number = 2;
const SIZEOF_SEQUENCE: number = 4;

export const RESPONSE_SUCCESS_CODE: number = 0;

export const config = {
  packet: {
    sizeOfSize: SIZEOF_SIZE,
    sizeOfId: SIZEOF_ID,
    sizeOfSequence: SIZEOF_SEQUENCE,
    sizeOfHeader: SIZEOF_SIZE + SIZEOF_ID + SIZEOF_SEQUENCE,
  },
};
