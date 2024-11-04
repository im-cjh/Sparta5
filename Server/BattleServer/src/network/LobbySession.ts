import { create } from '@bufbuild/protobuf';
import { Socket } from 'net';
import { PacketHeader } from 'ServerCore/network/PacketHeader';
import { ePacketId } from 'ServerCore/network/PacketId';
import { Session } from 'ServerCore/network/Session';
import { CustomError } from 'ServerCore/utils/error/CustomError';
import { ErrorCodes } from 'ServerCore/utils/error/ErrorCodes';
import { PacketUtils } from 'ServerCore/utils/parser/ParserUtils';
import { battleConfig } from 'src/config/config';
import lobbyHandlerMappings from 'src/handlers/lobby';

import { B2L_InitialPacket, B2L_InitialPacketSchema } from 'src/protocol/server_pb';
import { handleError } from 'src/utils/error/errorHandler';
import { v4 as uuidv4 } from 'uuid';

export class LobbySession extends Session {
  constructor(socket: Socket) {
    super(socket);

    this.setId('battleServerSession');
  }

  public connectLobbyServer(): void {
    this.socket.connect(battleConfig.lobbyServer.port, battleConfig.lobbyServer.host, async () => {
      console.log('Connected to server');
      const packet: B2L_InitialPacket = create(B2L_InitialPacketSchema, {
        serverId: this.getId(),
      });

      const sendBuffer: Buffer = PacketUtils.SerializePacket<B2L_InitialPacket>(packet, B2L_InitialPacketSchema, ePacketId.B2L_Init, 0);

      this.send(sendBuffer);
    });
  }
  protected onEnd(): void {
    throw new Error('Method not implemented.');
  }
  protected onError(error: any): void {
    console.error('소켓 오류:', error);

    handleError(this, new CustomError(500, `소켓 오류: ${error.message}`));
    // 세션에서 유저 삭제
    this.socket.destroy();
  }
  protected async handlePacket(packet: Buffer, header: PacketHeader): Promise<void> {
    console.log('핸들러 호출', header.id);
    try {
      //1. sequence 검증
      if (this.sequence != header.sequence) {
        //console.log('시퀀스가 잘못되었습니다.', this.sequence, header.sequence);
        //throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '시퀀스가 잘못되었습니다.');
      }

      //2. 패킷 ID에 해당하는 핸들러 확인
      const handler = lobbyHandlerMappings[header.id];

      //2-1. 핸들러가 존재하지 않을 경우 오류 출력
      if (!handler) {
        throw new CustomError(ErrorCodes.INVALID_PACKET_ID, `패킷id가 잘못되었습니다: ${header.id}`);
      }
      //3. 핸들러 호출
      await handler(packet, this);
    } catch (error) {
      handleError(this, error);
    }
  }
}
