import { create, toBinary } from "@bufbuild/protobuf";
import { RESPONSE_SUCCESS_CODE } from "ServerCore/constants";
import { ePacketId } from "ServerCore/network/PacketId";
import { ParserUtils } from "ServerCore/utils/parser/ParserUtils";
import { UserInfoSchema } from "src/common/protobuf/common/struct_pb";
import {
  L2C_EnterRoomNewUser,
  L2C_EnterRoomNewUserSchema,
} from "src/common/protobuf/game/room_pb";
import { eRoomStateId } from "src/constants/roomState";
import { LobbySession } from "src/network/LobbySession";
import { ResponseUtils } from "src/utils/response/ResponseUtils";

export class Room {
  /*---------------------------------------------
    [멤버 변수]
---------------------------------------------*/
  private id: number;
  private users: Array<LobbySession>;
  //private users: Set<LobbySession>;
  private state: eRoomStateId;
  private maxPlayerCount: number;

  /*---------------------------------------------
    [생성자]
---------------------------------------------*/
  constructor(id: number, maxPlayerCount: number = 2) {
    this.id = id;
    this.users = new Array();
    //this.users = new Set();
    this.state = eRoomStateId.WAITING; // 'waiting', 'inProgress'
    this.maxPlayerCount = maxPlayerCount;
  }

  /*---------------------------------------------
    [방 입장]
---------------------------------------------*/
  public enterRoom(newUser: LobbySession): boolean {
    console.log("Room::enterRoom");
    //1. 방이 가득 찼는지 확인
    if (this.users.length >= this.maxPlayerCount) {
      //if (this.users.size >= this.maxPlayerCount) {
      console.log("풀방");
      return false;
    }

    //2.  유저 추가
    this.users.push(newUser);
    //this.users.add(newUser);
    console.log("2.  유저 추가");

    //3. 기존 플레이어 목록을 유저에게 보내기
    {
      const existUsers = [];
      for (const user of this.users) {
        //if (user.getId() !== user.getId()) {
        existUsers.push(
          create(UserInfoSchema, {
            userId: user.getId(),
            nickname: user.getNickname(),
          })
        );
        //}
      }
      let packet: L2C_EnterRoomNewUser = create(L2C_EnterRoomNewUserSchema, {
        meta: ResponseUtils.createMetaResponse(RESPONSE_SUCCESS_CODE),
        isEntered: true,
        users: existUsers,
      });

      const sendBuffer = ParserUtils.SerializePacket(
        packet,
        L2C_EnterRoomNewUserSchema,
        ePacketId.L2C_EnterRoom,
        newUser.getNextSequence()
      );
      console.log("Serialized packet size:", sendBuffer.length);
      newUser.send(sendBuffer);
    }
    console.log("3.  기존 플레이어 목록을 유저에게 보내기");
    //4. 유저 입장을 다른 플레이어들에게 알리기
    console.log("4. 유저 입장을 다른 플레이어들에게 알리기");
    //6. 입장한 유저 정보를 기존 플레이어들에게 보내기

    //7. 가득 찼다면 3초 뒤 게임 시작
    // if (this.players.length === this.maxPlayerCount) {
    //   setTimeout(() => {
    //     this.startGame();
    //   }, 3000);
    // }
    return true;
  }

  /*---------------------------------------------
    [방 퇴장]
---------------------------------------------*/
  public leaveRoom(player: LobbySession): boolean {
    // 성공적으로 퇴장했다고 응답하기
    //다른 플레이들에게 전달하기
    return true;
  }

  /*---------------------------------------------
    [플레이어 정보 가져오기]
---------------------------------------------*/
  getUser(userId: string) {
    //return this.users.find((user) => user.getId() === userId);
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
