import { create, fromBinary, toBinary } from '@bufbuild/protobuf';
import net, { Socket } from 'net';

import { ParserUtils } from './src/utils/parser/ParserUtils';
import { PacketHeader } from './src/classes/models/PacketHeader';
import { config } from './src/config/config';
import { ePacketId } from './src/constants/packetId';
import { C2S_MetaDataSchema, C2S_Pos, C2S_PosSchema } from './src/common/protobuf/request/common_pb';
import { C2S_InitialPacket, C2S_InitialPacketSchema } from './src/common/protobuf/request/initial_pb';
import { S2C_InitSchema } from './src/common/protobuf/response/response_pb';

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
  const packet: C2S_InitialPacket = create(C2S_InitialPacketSchema, {
    meta: create(C2S_MetaDataSchema, {
      userId: 'im-cjh',
      clientVersion: '12.0.0',
    }),
    deviceId: 'xxxxx',
  });

  const sendBuffer: Buffer = ParserUtils.SerializePacket<C2S_InitialPacket>(packet, C2S_InitialPacketSchema, ePacketId.C2S_Init, 100);

  sendPacket(client, sendBuffer);
});

client.on('data', (data) => {
  const buffer = Buffer.from(data); // 버퍼 객체의 메서드를 사용하기 위해 변환

  const packetHeader: PacketHeader = ParserUtils.readPacketHeader(buffer);
  console.log('packetHeader: ', packetHeader);

  // 메시지 추출
  const slicedBuffer = buffer.slice(config.packet.sizeOfHeader); // 앞의 헤더 부분을 잘라낸다.

  const packet = fromBinary(S2C_InitSchema, slicedBuffer);
  console.log('server 에게 받은 메세지: ', packet);
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('Client error:', err);
});
