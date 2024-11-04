import { Socket } from 'net';
import { PacketHeader } from 'ServerCore/network/PacketHeader';
import { Session } from 'ServerCore/network/Session';
import { CustomError } from 'ServerCore/utils/error/CustomError';
import { ErrorCodes } from 'ServerCore/utils/error/ErrorCodes';
import battleHandlerMappings from 'src/handlers/battle';
import handlerMappings from 'src/handlers/user';
import { battleSessionManager } from 'src/server';
import { handleError } from 'src/utils/error/errorHandler';

export class BattleSession extends Session {
  constructor(socket: Socket) {
    super(socket);
  }

  protected onEnd(): void {
    throw new Error('Method not implemented.');
  }
  protected onError(error: any): void {
    console.error('소켓 오류:', error);

    handleError(this, new CustomError(500, `소켓 오류: ${error.message}`));
    // 세션에서 유저 삭제
    console.log('유저 제거: ', battleSessionManager.removeSession(this.getId()));
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
      const handler = battleHandlerMappings[header.id];

      //2-1. 핸들러가 존재하지 않을 경우 오류 출력
      if (!handler) {
        throw new CustomError(
          ErrorCodes.INVALID_PACKET_ID,
          `패킷id가 잘못되었습니다: ${header.id}`,
        );
      }
      //3. 핸들러 호출
      await handler(packet, this);
    } catch (error) {
      handleError(this, error);
    }
  }
}
