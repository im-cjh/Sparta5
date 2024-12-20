import { create, toBinary } from '@bufbuild/protobuf';
import { RESPONSE_SUCCESS_CODE } from 'ServerCore/config/config';

import { ePacketId } from 'ServerCore/network/PacketId';
import { PacketUtils } from 'ServerCore/utils/parser/ParserUtils';
import { LobbySession } from 'src/Main/LobbySession';
import {
  L2C_EnterRoomMe,
  L2C_EnterRoomMeSchema,
  L2C_EnterRoomOther,
  L2C_EnterRoomOtherSchema,
} from 'src/Protocol/room_pb';
import { RoomInfoSchema, UserInfoSchema } from 'src/protocol/struct_pb';
import { ResponseUtils } from 'src/utils/response/ResponseUtils';

export enum eRoomStateId {
  WAITING = 0,
  IN_PROGRESS = 1,
}

export class Room {
  /*---------------------------------------------
    [멤버 변수]
---------------------------------------------*/
  private id: number;
  private roomName: string;
  private users: Array<LobbySession>;
  private state: eRoomStateId;
  private maxPlayerCount: number;

  /*---------------------------------------------
    [생성자]
---------------------------------------------*/
  constructor(id: number, roomName: string, maxPlayerCount: number = 2) {
    this.id = id;
    this.roomName = roomName;
    this.users = new Array();
    //this.users = new Set();
    this.state = eRoomStateId.WAITING; // 'waiting', 'inProgress'
    this.maxPlayerCount = maxPlayerCount;
  }

  /*---------------------------------------------
    [방 입장]
    // 1. 방이 가득 찼는지 확인
    // 2. 기존 플레이어 목록을 유저에게 보내기
    // 3.  유저 추가
    // 4. 새 유저 입장 정보를 다른 유저들에게 알리기
---------------------------------------------*/
  public enterRoom(newUser: LobbySession): boolean {
    console.log('Room::enterRoom');
    //1. 방이 가득 찼는지 확인
    if (this.users.length >= this.maxPlayerCount) {
      console.log('풀방');
      return false;
    }

    //2. 기존 플레이어 목록을 유저에게 보내기
    {
      const existUsers = [];
      for (const user of this.users) {
        //if (user.getId() !== user.getId()) {
        existUsers.push(
          create(UserInfoSchema, {
            userId: user.getId(),
            nickname: user.getNickname(),
          }),
        );
        //}
      }
      let packet: L2C_EnterRoomMe = create(L2C_EnterRoomMeSchema, {
        meta: ResponseUtils.createMetaResponse(RESPONSE_SUCCESS_CODE),
        users: existUsers,
        roomInfo: create(RoomInfoSchema, {
          roomId: this.id,
          roomName: this.roomName,
          currentPlayers: this.getCurrentUsersCount(),
          maxPlayers: this.maxPlayerCount,
        }),
      });

      const sendBuffer = PacketUtils.SerializePacket(
        packet,
        L2C_EnterRoomMeSchema,
        ePacketId.L2C_EnterRoomMe,
        newUser.getNextSequence(),
      );
      console.log('Serialized packet size:', sendBuffer.length);
      newUser.send(sendBuffer);
    }

    //3.  유저 추가
    this.users.push(newUser);

    // 4. 새 유저 입장 정보를 다른 유저들에게 알리기
    {
      const newUserInfo = create(UserInfoSchema, {
        userId: newUser.getId(),
        nickname: newUser.getNickname(),
      });

      console.log('아이디는 ', newUserInfo.userId);
      const packet: L2C_EnterRoomOther = create(L2C_EnterRoomOtherSchema, {
        meta: ResponseUtils.createMetaResponse(RESPONSE_SUCCESS_CODE),
        newUser: newUserInfo,
      });

      const sendBuffer: Buffer = PacketUtils.SerializePacket(
        packet,
        L2C_EnterRoomOtherSchema,
        ePacketId.L2C_EnterRoomOther,
        0,
      );

      this.broadcast(sendBuffer);
    }

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

  /*---------------------------------------------
    [broadcast]
---------------------------------------------*/
  public broadcast(buffer: Buffer) {
    for (const user of this.users) {
      user.send(buffer);
    }
  }
  /*---------------------------------------------
    [getter]
---------------------------------------------*/
  getRoomName() {
    return this.roomName;
  }

  getCurrentUsersCount() {
    return this.users.length;
  }

  getMaxUsersCount() {
    return this.maxPlayerCount;
  }
}
