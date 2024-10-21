import { ePacketId } from '../constants/header';

export interface PacketHeader {
  size: number;
  id: ePacketId;
}
