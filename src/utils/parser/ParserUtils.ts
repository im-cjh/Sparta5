import fs from 'fs';
import path, { resolve } from 'path';

import { config } from '../../config/config';

import { create, fromBinary, toBinary } from '@bufbuild/protobuf';
import { Packet, PacketSchema } from '../../../Protocol/request/common_pb';
import { encoder, Message } from 'protobufjs';
import { PacketHeader } from '../../types';
import { ePacketId } from '../../constants/packetHeader';

//import { PacketSchema } from '../../../Protocol/request/common_pb';
//최상위 경로 + assets 폴더
export class ParserUtils {
  /*---------------------------------------------
    [헤더 파싱]
---------------------------------------------*/
  static readPacketHeader(buffer: Buffer): PacketHeader {
    // processLen 위치에서 id와 size를 각각 읽음
    const size = buffer.readUInt16BE(0); //2바이트
    const id = buffer.readUInt16BE(config.packet.sizeOfSize); // 2바이트

    return { id, size };
  }

  /*---------------------------------------------
    [패킷 파싱]
---------------------------------------------*/
  static packetParse(data: Buffer) {
    console.log(data);

    console.log('dd');
    return data;
  }

  static SerializePacket(packet: Packet, id: ePacketId): Buffer {
    const packetBuffer: Uint8Array = toBinary(PacketSchema, packet);
    encoder;
    //헤더 크기 + 가변 길이의 패킷 크기
    const sendBufferSize: number = config.packet.sizeOfHeader + packetBuffer.byteLength;

    //헤더 크기+패킷 크기만큼 버퍼 할당
    const sendBuffer = Buffer.alloc(sendBufferSize);

    const header = sendBuffer.subarray(0, config.packet.sizeOfHeader);

    //size 삽입
    header.writeUInt16BE(sendBufferSize);
    //id 삽입
    header.writeUInt16BE(ePacketId.NORMAL, config.packet.sizeOfSize);

    //packetBuffer랑 합치기
    sendBuffer.copy(sendBuffer, config.packet.sizeOfHeader);

    return sendBuffer;
  }
}
