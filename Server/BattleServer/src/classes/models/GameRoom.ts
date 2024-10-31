import { create, toBinary } from '@bufbuild/protobuf';
import { RESPONSE_SUCCESS_CODE } from 'ServerCore/constants';
import { ePacketId } from 'ServerCore/network/PacketId';
import { ParserUtils } from 'ServerCore/utils/parser/ParserUtils';
import { BattleSession } from 'src/network/BattleSession';
import { LobbySession } from 'src/network/LobbySession';
import { L2C_EnterRoomMe, L2C_EnterRoomMeSchema } from 'src/protocol/room_pb';
import { UserInfoSchema } from 'src/protocol/struct_pb';
import { ResponseUtils } from 'src/utils/response/ResponseUtils';

export class GameRoom {
  /*---------------------------------------------
    [멤버 변수]
---------------------------------------------*/
  private id: number;
  private users: Array<BattleSession>;
  private maxPlayerCount: number;

  /*---------------------------------------------
    [생성자]
---------------------------------------------*/
  constructor(id: number, maxPlayerCount: number) {
    this.users = new Array();
    this.id = id;
    this.maxPlayerCount = maxPlayerCount;
  }

  /*---------------------------------------------
    [방 입장]
    // 1. 방이 가득 찼는지 확인
    // 2. 기존 플레이어 목록을 유저에게 보내기
    // 3.  유저 추가
    // 4. 새 유저 입장 정보를 다른 유저들에게 알리기
---------------------------------------------*/

  /*---------------------------------------------
    [방 퇴장]
---------------------------------------------*/

  /*---------------------------------------------
    [플레이어 정보 가져오기]
---------------------------------------------*/

  /*---------------------------------------------
    [게임 시작]
---------------------------------------------*/

  /*---------------------------------------------
    [broadcast]
---------------------------------------------*/
  private broadcast(buffer: Buffer) {
    for (const user of this.users) {
      user.send(buffer);
    }
  }
  /*---------------------------------------------
    [getter]
---------------------------------------------*/
}
