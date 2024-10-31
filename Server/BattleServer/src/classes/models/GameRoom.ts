import { create, toBinary } from '@bufbuild/protobuf';
import { RESPONSE_SUCCESS_CODE } from 'ServerCore/constants';
import { ePacketId } from 'ServerCore/network/PacketId';
import { PacketUtils } from 'ServerCore/utils/parser/ParserUtils';
import { BattleSession } from 'src/network/BattleSession';
import { LobbySession } from 'src/network/LobbySession';
import { B2C_EnterRoomSchema, B2C_GameStartSchema } from 'src/protocol/game_pb';
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
    // 2. 유저 추가
    // 3. 해당 유저에게 B2C_EnterRoom패킷 전송
    // 3. 모든 인원이 들어왔다면 B2C_GameStart패킷 전송
---------------------------------------------*/
  public enterRoom(session: BattleSession) {
    console.log('enterRoom');

    // 1. 방이 가득 찼는지 확인
    if (this.users.length >= this.maxPlayerCount) {
      console.error(`방이 가득 찼습니다. (방 ID: ${this.id})`);
      return;
    }

    // 2. 유저 추가
    this.users.push(session);
    console.log(`유저가 방에 입장했습니다. 현재 인원: ${this.users.length}/${this.maxPlayerCount}`);

    // 3. 해당 유저에게 B2C_EnterRoomMe 패킷 전송
    const userInfo = create(UserInfoSchema, {
      userId: session.getId(),
      nickname: session.getNickname(),
    });

    const enterRoomPacket = create(B2C_EnterRoomSchema, {
      meta: ResponseUtils.createMetaResponse(RESPONSE_SUCCESS_CODE),
    });

    const enterRoomBuffer = PacketUtils.SerializePacket(enterRoomPacket, B2C_EnterRoomSchema, ePacketId.B2C_Enter, session.getNextSequence());
    session.send(enterRoomBuffer);

    // 4. 모든 인원이 들어왔다면 B2C_GameStart 패킷 전송
    if (this.users.length === this.maxPlayerCount) {
      console.log('모든 유저가 입장하였습니다. 게임을 시작합니다.');

      const gameStartPacket = create(B2C_GameStartSchema, {
        isStart: true,
      });

      const gameStartBuffer = PacketUtils.SerializePacket(gameStartPacket, B2C_GameStartSchema, ePacketId.B2C_GameStart, session.getNextSequence());

      this.broadcast(gameStartBuffer);
    }
  }
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
