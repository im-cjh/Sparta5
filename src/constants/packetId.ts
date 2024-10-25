export const SIZEOF_SIZE: number = 2;
export const SIZEOF_ID: number = 2;
export const SIZEOF_SEQUENCE: number = 4;
export const RESPONSE_SUCCESS_CODE: number = 0;

export enum ePacketId {
  S2C_Error = 0,
  C2S_Init = 1,
  C2S_EnterRoom = 2,
  S2C_Init = 51,
  S2C_EnterRoom = 52,
}
