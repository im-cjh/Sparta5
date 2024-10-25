import { ePacketId } from '../../constants/packetId';

export interface PacketHeader {
  size: number;
  id: ePacketId;
  sequence: number;
}
