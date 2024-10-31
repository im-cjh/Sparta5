import { Socket } from 'node:net';
import defaultHandler from 'ServerCore/handlers/default.handler';
import { LobbySession } from 'src/network/LobbySession';
import initialHandler from './initial.handler';
import { ePacketId } from 'ServerCore/network/PacketId';
import { roomManager } from 'src/classes/managers/RoomManager';
import { BattleSession } from 'src/network/BattleSession';

type PacketHandler = (buffer: Buffer, session: LobbySession | BattleSession) => unknown;

const handlerMappings: Record<ePacketId, PacketHandler> = {
  [ePacketId.C2L_EnterRoom]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    roomManager.enterRoomHandler(buffer, session),
  [ePacketId.C2L_LeaveRoom]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    roomManager.enterRoomHandler(buffer, session),
  [ePacketId.C2L_GetRooms]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    roomManager.getRoomsHandler(buffer, session),
  [ePacketId.C2L_GameStart]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    roomManager.gameStartHandler(buffer, session),

  [ePacketId.C2L_Init]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    defaultHandler(buffer, session),
  [ePacketId.L2C_EnterRoomMe]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    defaultHandler(buffer, session),
  [ePacketId.L2C_LeaveRoomMe]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    defaultHandler(buffer, session),
  [ePacketId.L2C_Init]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    defaultHandler(buffer, session),
  [ePacketId.S2C_Error]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    defaultHandler(buffer, session),
  [ePacketId.L2C_GetRoom]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    defaultHandler(buffer, session),
  [ePacketId.L2C_EnterRoomOther]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    defaultHandler(buffer, session),
  [ePacketId.L2C_LeaveRoomOther]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    defaultHandler(buffer, session),
  [ePacketId.B2L_Init]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    defaultHandler(buffer, session),

  [ePacketId.L2C_GameStart]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    defaultHandler(buffer, session),
  [ePacketId.L2B_Init]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    defaultHandler(buffer, session),
  [ePacketId.C2B_Init]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    defaultHandler(buffer, session),
  [ePacketId.B2C_Init]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    defaultHandler(buffer, session),
  [ePacketId.L2B_CreateRoom]: (buffer: Buffer, session: LobbySession | BattleSession) =>
    defaultHandler(buffer, session),
  [ePacketId.B2L_CreateRoom]: function (
    buffer: Buffer,
    session: LobbySession | BattleSession,
  ): unknown {
    console.log();
    return;
  },
};

export default handlerMappings;
