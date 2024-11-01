import fs from "fs";
import path, { resolve } from "path";
import { fromBinary, Message, toBinary } from "@bufbuild/protobuf";
import { config } from "../../config/config";
import { PacketHeader } from "../../network/PacketHeader";
import { ePacketId } from "../../network/PacketId";
import { GenMessage } from "@bufbuild/protobuf/dist/cjs/codegenv1/types";

//import { PacketSchema } from '../../../Protocol/request/common_pb';
//최상위 경로 + assets 폴더
export class PacketUtils {
  /*---------------------------------------------
    [헤더 파싱]
---------------------------------------------*/
  static readPacketHeader(buffer: Buffer): PacketHeader {
    const size = buffer.readUInt16LE(0); //2바이트
    const id = buffer.readUInt16LE(config.packet.sizeOfSize); // 2바이트
    const sequence: number = buffer.readUint32LE(config.packet.sizeOfSequence);
    return { size, id, sequence };
  }

  static SerializePacket<T extends Message>(
    packet: T,
    packetSchema: GenMessage<T>,
    id: ePacketId,
    sequence: number
  ): Buffer {
    const packetBuffer: Uint8Array = toBinary(packetSchema, packet);

    //헤더 크기 + 가변 길이의 패킷 크기
    const sendBufferSize: number =
      config.packet.sizeOfHeader + packetBuffer.byteLength;

    //헤더 크기+패킷 크기만큼 버퍼 할당
    const sendBuffer = Buffer.alloc(sendBufferSize);

    const header = sendBuffer.subarray(0, config.packet.sizeOfHeader);

    //size 삽입
    header.writeUInt16LE(sendBufferSize);
    //id 삽입
    header.writeUInt16LE(id, config.packet.sizeOfSize);
    //sequence 삽입
    header.writeUInt32LE(
      sequence,
      config.packet.sizeOfSize + config.packet.sizeOfId
    );

    //packetBuffer랑 합치기
    Buffer.from(packetBuffer).copy(sendBuffer, config.packet.sizeOfHeader);

    return sendBuffer;
  }
}
