import { Socket } from 'node:net';
import defaultHandler from 'ServerCore/handlers/default.handler';
import { LobbySession } from 'src/network/LobbySession';
import initialHandler from './initial.handler';
import { ePacketId } from 'ServerCore/network/PacketId';
import { roomManager } from 'src/classes/managers/RoomManager';

type PacketHandler = (buffer: Buffer, session: LobbySession) => void;

const handlerMappings: Record<ePacketId, PacketHandler> | any = {
  [ePacketId.C2L_EnterRoom]: (buffer: Buffer, session: LobbySession) =>
    roomManager.enterRoomHandler(buffer, session),
  [ePacketId.C2L_LeaveRoom]: (buffer: Buffer, session: LobbySession) =>
    roomManager.enterRoomHandler(buffer, session),
  [ePacketId.C2L_GetRooms]: (buffer: Buffer, session: LobbySession) =>
    roomManager.getRoomsHandler(buffer, session),
  [ePacketId.C2L_GameStart]: (buffer: Buffer, session: LobbySession) =>
    roomManager.gameStartHandler(buffer, session),

  [ePacketId.C2L_Init]: (buffer: Buffer, session: LobbySession) => defaultHandler(buffer, session),
  [ePacketId.B2L_Init]: (buffer: Buffer, session: LobbySession) => defaultHandler(buffer, session),

  [ePacketId.B2L_CreateRoom]: function (buffer: Buffer, session: LobbySession) {
    console.log('B2L_CreateRoom ㅇㅇ');
  },
  [ePacketId.S2C_Error]: function (buffer: Buffer, session: LobbySession) {
    console.log('에러 ㅇㅇ');
  },
};

export default handlerMappings;
