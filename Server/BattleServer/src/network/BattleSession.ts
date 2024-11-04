import { Socket } from 'net';
import { PacketHeader } from 'ServerCore/network/PacketHeader';
import { Session } from 'ServerCore/network/Session';
import { CustomError } from 'ServerCore/utils/error/CustomError';
import { ErrorCodes } from 'ServerCore/utils/error/ErrorCodes';
import handlerMappings from 'src/handlers/user';
import { handleError } from 'src/utils/error/errorHandler';

export class BattleSession extends Session {
  private nickname: string = 'tmpName';

  constructor(socket: Socket) {
    super(socket);
  }

  protected onEnd(): void {
    throw new Error('Method not implemented.');
  }
  protected onError(error: any): void {
    throw new Error('Method not implemented.');
  }
  protected async handlePacket(packet: Buffer, header: PacketHeader): Promise<void> {
    //console.log('핸들러 호출');
    try {
      //1. sequence 검증
      if (this.sequence != header.sequence) {
        //console.log('시퀀스가 잘못되었습니다.', this.sequence, header.sequence);
        // throw new CustomError(
        //   ErrorCodes.INVALID_SEQUENCE,
        //   "시퀀스가 잘못되었습니다."
        // );
      }

      //2. 패킷 ID에 해당하는 핸들러 확인
      const handler = handlerMappings[header.id];

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

  public getNickname() {
    return this.nickname;
  }

  public setNickname(nickname: string) {
    this.nickname = nickname;
  }
}
