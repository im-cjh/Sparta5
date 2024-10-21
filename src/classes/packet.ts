export enum ePacketId {
  RecoverGameState = 2,
}

export interface PacketHeader {
  size: number;
  id: ePacketId;
}
