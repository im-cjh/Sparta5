export const SIZEOF_SIZE: number = 2;
export const SIZEOF_ID: number = 2;
export const SIZEOF_SEQUENCE: number = 4;
export const RESPONSE_SUCCESS_CODE: number = 0;

export enum ePacketId {
  // PING = 0,
  C2S_Init = 1,
  S2C_Init = 51,
  S2C_Error = 100,
}
