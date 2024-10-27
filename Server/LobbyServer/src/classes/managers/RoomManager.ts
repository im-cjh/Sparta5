import { create, fromBinary, toBinary } from "@bufbuild/protobuf";
import { RESPONSE_SUCCESS_CODE } from "ServerCore/constants";
import {
  C2L_EnterRoom,
  C2L_EnterRoomSchema,
  L2C_EnterRoomNewUserSchema,
} from "src/common/protobuf/game/room_pb";
import { LobbySession } from "src/network/LobbySession";
import { ResponseUtils } from "src/utils/response/ResponseUtils";
import { Room } from "../models/Room";
import { ParserUtils } from "ServerCore/utils/parser/ParserUtils";

class RoomManager {
  /*---------------------------------------------
  [멤버 변수]
  -users: 
    일단 LobbySession으로 사용하기...
---------------------------------------------*/
  private rooms = new Map<BigInt, Room>();

  constructor() {
    this.rooms.set(BigInt(0), new Room(0, 2));
  }

  /*---------------------------------------------
    [방 입장]
---------------------------------------------*/
  enterRoomHandler(buffer: Buffer, session: LobbySession) {
    console.log("enterRoomHandler");
    //패킷 분해
    const packet: C2L_EnterRoom = fromBinary(C2L_EnterRoomSchema, buffer);

    //방id가 유효한지 검증

    //Room::enterRoom()호출
    this.rooms.get(packet.roomId)?.enterRoom(session);
  }

  /*---------------------------------------------
    [방 퇴장]
---------------------------------------------*/
  leaveRoom() {}
}

export const roomManager = new RoomManager();
