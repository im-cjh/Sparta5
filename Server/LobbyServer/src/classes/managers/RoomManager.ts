import { create, fromBinary, toBinary } from '@bufbuild/protobuf';
import { RESPONSE_SUCCESS_CODE } from 'ServerCore/constants';

import { LobbySession } from 'src/network/LobbySession';
import { ResponseUtils } from 'src/utils/response/ResponseUtils';
import { Room } from '../models/Room';
import { ParserUtils } from 'ServerCore/utils/parser/ParserUtils';
import {
  C2L_EnterRoom,
  C2L_EnterRoomSchema,
  C2L_GameStartSchema,
  C2L_LeaveRoom,
  C2L_LeaveRoomSchema,
  C2L_RoomList,
  C2L_RoomListSchema,
  L2B_CreateRoomSchema,
  L2C_RoomListSchema,
} from 'src/protocol/room_pb';
import { RoomInfoSchema } from 'src/protocol/struct_pb';
import { ePacketId } from 'ServerCore/network/PacketId';
import { CustomError } from 'ServerCore/utils/error/CustomError';
import { ErrorCodes } from 'ServerCore/utils/error/ErrorCodes';
import { battleSessionManager } from 'src/server';
import { BattleSession } from 'src/network/BattleSession';
import { send } from 'process';

const MAX_ROOMS_SIZE: number = 10000;

class RoomManager {
  /*---------------------------------------------
  [멤버 변수]
  -users: 
    일단 LobbySession으로 사용하기...
---------------------------------------------*/
  private rooms = new Map<number, Room>();
  private availableRoomIds = Array.from({ length: MAX_ROOMS_SIZE }, (_, i) => i + 1);

  constructor() {
    const tmpRoomId: number = this.availableRoomIds.shift() || 0;
    this.rooms.set(tmpRoomId, new Room(tmpRoomId, '정현의 방', 2));
  }

  /*---------------------------------------------
    [방 입장]
---------------------------------------------*/
  enterRoomHandler(buffer: Buffer, session: LobbySession | BattleSession) {
    console.log('enterRoomHandler');
    //패킷 분해
    const packet: C2L_EnterRoom = fromBinary(C2L_EnterRoomSchema, buffer);

    //방id가 유효한지 검증

    //Room::enterRoom()호출
    this.rooms.get(packet.roomId)?.enterRoom(session);
  }

  /*---------------------------------------------
    [방 퇴장]
---------------------------------------------*/
  leaveRoomHandler(buffer: Buffer, session: LobbySession) {
    console.log('leaveRoomHandler');
    // 패킷 분해
    const packet: C2L_LeaveRoom = fromBinary(C2L_LeaveRoomSchema, buffer);
    this.rooms.get(packet.roomId)?.leaveRoom(session);
  }

  /*---------------------------------------------
    [방 목록 조회]
---------------------------------------------*/
  getRoomsHandler(buffer: Buffer, session: LobbySession | BattleSession) {
    console.log('getRoomsHandler called');
    // 방 목록을 담을 배열 초기화
    const roomInfos = [];

    // 방 목록을 순회하면서 RoomInfo 메시지 생성
    for (const [roomId, room] of this.rooms) {
      const roomInfo = create(RoomInfoSchema, {
        roomId,
        roomName: room.getRoomName(),
        currentPlayers: room.getCurrentUsersCount(),
        maxPlayers: room.getMaxUsersCount(),
      });
      roomInfos.push(roomInfo);
    }

    const packet = create(L2C_RoomListSchema, {
      meta: ResponseUtils.createMetaResponse(RESPONSE_SUCCESS_CODE),
      rooms: roomInfos,
    });

    const sendBuffer = ParserUtils.SerializePacket(
      packet,
      L2C_RoomListSchema,
      ePacketId.L2C_GetRoom,
      session.getNextSequence(),
    );
    session.send(sendBuffer);
  }

  /*---------------------------------------------
    [게임 시작]
    
    - 배틀서버에게 게임 방 생성 요청
    - 클라에게 배틀 서버의 주소와 포트번호, 게임 방ID 전송 
  ---------------------------------------------*/
  public gameStartHandler(buffer: Buffer, sesison: LobbySession | BattleSession) {
    console.log('gameStartHandler');
    const battleSession: BattleSession | null =
      battleSessionManager.getSessionOrNull('battleServerSession');

    if (!battleSession) {
      console.log('!BattleServerSession을 찾을 수 없습니다.');
      throw new CustomError(ErrorCodes.SOCKET_ERROR, 'BattleServerSession을 찾을 수 없습니다.');
    }

    const packet = fromBinary(C2L_GameStartSchema, buffer);

    const L2BPacket = create(L2B_CreateRoomSchema, {
      roomId: packet.roomId,
      maxPlayers: packet.maxPlayers,
    });

    const sendBuffer: Buffer = ParserUtils.SerializePacket(
      L2BPacket,
      L2B_CreateRoomSchema,
      ePacketId.L2B_CreateRoom,
      sesison.getNextSequence(),
    );

    console.log('보내기 직전');
    battleSession.send(sendBuffer);
    console.log('보내기 직후');
  }
  /*---------------------------------------------
    [방 ID 해제]
    사용하지 않는 방 ID를 큐에 반환하여 재사용 가능하게 만듦
  ---------------------------------------------*/
  public freeRoomId(roomId: number) {
    if (!this.rooms.has(roomId)) {
      console.log('유효하지 않은 roomID');
      return;
      //throw new CustomError(ErrorCodes.)
    }

    this.rooms.delete(roomId);
    this.availableRoomIds.push(roomId);
  }
}
export const roomManager = new RoomManager();
