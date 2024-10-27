import { ePacketId } from "./PacketId";

export interface PacketHeader {
  size: number;
  id: ePacketId;
  sequence: number;
}
