import { create, toBinary } from '@bufbuild/protobuf';
import { eRoomStateId } from '../../constants/roomState';
import Player from './Player';
import { ParserUtils } from '../../utils/parser/ParserUtils';
import { ResponseUtils } from '../../utils/response/responseUtils';
import { ePacketId, RESPONSE_SUCCESS_CODE } from '../../constants/packetId';
import { ObjectInfoSchema, PosInfoSchema } from '../../common/protobuf/struct_pb';
import { ObjectType, ObjectTypeSchema } from '../../common/protobuf/enum_pb';
import { S2C_ENTER_ROOM, S2C_ENTER_ROOMSchema } from '../../common/protobuf/response/contents_pb';
import { GameObject } from './GameObject';

const MAX_PLAYERS = 2;

export class Room {
  /*---------------------------------------------
    [멤버 변수]
---------------------------------------------*/
  private id: number;
  private players: Array<Player>;
  private state: eRoomStateId;
  private maxPlayerCount: number;

  /*---------------------------------------------
    [생성자]
---------------------------------------------*/
  constructor(id: number, maxPlayerCount: number = 2) {
    this.id = id;
    this.players = [];
    this.state = eRoomStateId.WAITING; // 'waiting', 'inProgress'
    this.maxPlayerCount = maxPlayerCount;
  }

  /*---------------------------------------------
    [방 입장]
---------------------------------------------*/
  public enterRoom(player: Player): boolean {
    //1. 방이 가득 찼는지 확인
    if (this.players.length >= this.maxPlayerCount) {
      return false;
    }

    //2.  유저 추가
    this.players.push(player);

    //3. 성공적으로 입장했다고 응답하기
    {
      let enterGamePacket = ResponseUtils.createEnterGameResponse({ x: 0, y: 0 }, player.session.getId());

      const sendBuffer: Buffer = ParserUtils.SerializePacket<S2C_ENTER_ROOM>(
        enterGamePacket,
        S2C_ENTER_ROOMSchema,
        ePacketId.S2C_EnterRoom,
        player.session.getNextSequence(),
      );
      player.session.send(sendBuffer);
    }

    //4. 유저 입장을 다른 플레이어들에게 알리기

    //5. 기존 플레이어 목록을 유저에게 보내기

    //6. 입장한 유저 정보를 기존 플레이어들에게 보내기

    //7. 가득 찼다면 3초 뒤 게임 시작
    if (this.players.length === this.maxPlayerCount) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
    return true;
  }

  /*---------------------------------------------
    [방 퇴장]
---------------------------------------------*/
  public leaveRoom(player: Player): boolean {
    // 성공적으로 퇴장했다고 응답하기
    //다른 플레이들에게 전달하기
    return true;
  }

  /*---------------------------------------------
    [플레이어 정보 가져오기]
---------------------------------------------*/
  getUser(userId: string) {
    return this.players.find((user) => user.id === userId);
  }

  /*---------------------------------------------
    [게임 시작]
---------------------------------------------*/
  startGame() {
    this.state = eRoomStateId.IN_PROGRESS;

    //Game인스턴스 생성

    //생성한 Game에 players정보 넣기

    //gameStart패킷 전송
  }
}
