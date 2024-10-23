import { create, toBinary } from '@bufbuild/protobuf';
import net, { Socket } from 'net';

import { ParserUtils } from './utils/parser/ParserUtils';
import { PacketHeader } from './types';
import { Message } from 'protobufjs';
import { config } from './config/config';
import { ePacketId } from './constants/packetId';
import { C2SPos, C2SPosSchema, MetaDataSchema } from '../Protocol/request/common_pb';

//임시 테스트
const sendPacket = (socket: Socket, sendBuffer: Buffer) => {
  socket.write(sendBuffer);
};

// 서버에 연결할 호스트와 포트
const HOST = 'localhost';
const PORT = 3000;

const client = new net.Socket();

client.connect(PORT, HOST, async () => {
  console.log('Connected to server');

  const pos = create(C2SPosSchema, {
    meta: create(MetaDataSchema, {
      userId: 'im-cjh',
      clientVersion: '1.0.0',
      sequence: 0,
    }),
    y: 5,
    x: 10,
  });

  const sendBuffer: Buffer = ParserUtils.SerializePacket<C2SPos>(
    pos,
    C2SPosSchema,
    ePacketId.NORMAL,
  );

  sendPacket(client, sendBuffer);
});

client.on('data', (data) => {
  const buffer = Buffer.from(data); // 버퍼 객체의 메서드를 사용하기 위해 변환

  const packetHeadr: PacketHeader = ParserUtils.readPacketHeader(buffer);
  console.log(`handlerId: ${packetHeadr.id}`);
  console.log(`length: ${packetHeadr.size}`);

  const headerSize = config.packet.sizeOfHeader;
  // 메시지 추출
  const message = buffer.slice(headerSize); // 앞의 헤더 부분을 잘라낸다.

  console.log(`server 에게 받은 메세지: ${message}`);
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('Client error:', err);
});
