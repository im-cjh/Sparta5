import { Type } from 'protobufjs';
import { ePacketId } from '../constants/packetHeader';

export interface PacketHeader {
  size: number;
  id: ePacketId;
}

export type ProtoMessagesType = {
  [namespace: string]: {
    [type: string]: Type;
  };
};
