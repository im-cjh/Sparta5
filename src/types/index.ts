import { Type } from 'protobufjs';
import { ePacketId } from '../constants/packetId';

export interface PacketHeader {
  size: number;
  id: ePacketId;
}

export type ProtoMessagesType = {
  [namespace: string]: {
    [type: string]: Type;
  };
};
