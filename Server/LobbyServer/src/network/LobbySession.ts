import { PacketHeader } from 'ServerCore/network/PacketHeader';
import { Session } from 'ServerCore/network/Session';
import { sessionManager } from 'src/server';
import { handleError } from 'src/utils/error/errorHandler';
import { CustomError } from 'ServerCore/utils/error/CustomError';

import { ErrorCodes } from 'ServerCore/utils/error/ErrorCodes';
import { Socket } from 'net';
import handlerMappings from 'src/handlers/user';

export class LobbySession extends Session {
  private nickname: string = 'tmpName';

  constructor(socket: Socket) {
    super(socket);
  }
  /*---------------------------------------------
    [onEnd]
    - 발생 조건: 상대방이 FIN패킷을 보냈을 때 
    - 목적: 자원을 정리하거나 로그를 남기기
---------------------------------------------*/
  protected onEnd(): void {
    console.log('클라이언트 연결이 종료되었습니다.');

    sessionManager.removeSession(this.getId());
  }

  /*---------------------------------------------
    [onError]
    - 발생 조건: 에러가 발생했을 때
    - 목적: 예외 상황을 적절히 처리하고 로그를 남기거나 대응을 하기
    
    - 이 이벤트 이후 곧바로 close이벤트 호출
---------------------------------------------*/
  protected onError(error: any): void {
    console.error('소켓 오류:', error);

    handleError(this, new CustomError(500, `소켓 오류: ${error.message}`));
    // 세션에서 유저 삭제
    console.log('유저 제거: ', sessionManager.removeSession(this.getId()));
  }

  /*---------------------------------------------
    [handlePacket]
    - 목적: 수신한 패킷의 Id에 맞는 함수 호출

    1. sequence 검증
    2. 패킷 ID에 해당하는 핸들러 확인
      2-1. 핸들러가 존재하지 않을 경우 오류 출력
    3. 핸들러 호출
---------------------------------------------*/
  protected async handlePacket(packet: Buffer, header: PacketHeader): Promise<void> {
    console.log('핸들러 호출');
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

  /*---------------------------------------------
    [getter]
---------------------------------------------*/
  public getNickname() {
    return this.nickname;
  }

  /*---------------------------------------------
    [setter]
---------------------------------------------*/
  public setNickname(nickname: string) {
    this.nickname = nickname;
  }
}
