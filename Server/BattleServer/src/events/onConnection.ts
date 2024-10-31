import { Socket } from 'net';
import { config } from 'ServerCore/config/config';
import { PacketUtils } from 'ServerCore/utils/parser/ParserUtils';
import { PacketHeader } from 'ServerCore/network/PacketHeader';
import { fromBinary } from '@bufbuild/protobuf';
import { C2L_InitialPacketSchema } from 'src/protocol/client_pb';
import { ePacketId } from 'ServerCore/network/PacketId';
import initialHandler from 'src/handlers/user/initial.handler';

export const onConnection = (socket: Socket): void => {
  console.log('새로운 연결이 감지되었습니다:', socket.remoteAddress, socket.remotePort);

  let buffer = Buffer.alloc(0);

  socket.on('data', (data: Buffer) => {
    buffer = Buffer.concat([buffer, data]);

    // 최소한 헤더는 파싱할 수 있어야 한다
    if (buffer.length < config.packet.sizeOfHeader) {
      return;
    }

    let header: PacketHeader = PacketUtils.readPacketHeader(buffer);
    // 헤더에 기록된 패킷 크기를 파싱할 수 있어야 한다
    if (buffer.length < header.size) {
      console.log('파싱X', buffer.length, header.size);
      return;
    }

    const packet = buffer.subarray(config.packet.sizeOfHeader, header.size);

    if (header.id == ePacketId.C2B_Init) {
      console.log('클라 접속');
      initialHandler(packet, socket);
    } else {
      console.log('먼지 모르겥는거 두두등장');
      socket.destroy();
    }
  });
};
