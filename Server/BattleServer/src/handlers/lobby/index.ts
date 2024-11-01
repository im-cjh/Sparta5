import { Socket } from 'node:net';
import defaultHandler from 'ServerCore/handlers/default.handler';
import { LobbySession } from 'src/network/LobbySession';
import { ePacketId } from 'ServerCore/network/PacketId';
import { BattleSession } from 'src/network/BattleSession';
import { gameRoomManager } from 'src/classes/managers/GameRoomManager';

type PacketHandler = (buffer: Buffer, session: LobbySession) => void;

const lobbyHandlerMappings: Record<ePacketId, PacketHandler> | any = {
  [ePacketId.L2B_CreateRoom]: (buffer: Buffer, session: LobbySession) => gameRoomManager.createGameRoomHandler(buffer, session),
  [ePacketId.L2B_Init]: (buffer: Buffer, session: LobbySession) => defaultHandler(buffer, session),
  [ePacketId.B2L_CreateRoom]: (buffer: Buffer, session: LobbySession) => defaultHandler(buffer, session),
  [ePacketId.B2L_Init]: (buffer: Buffer, session: LobbySession) => defaultHandler(buffer, session),
  [ePacketId.S2C_Error]: function (buffer: Buffer, session: LobbySession) {
    console.log('에러 ㅇㅇ');
  },
};

export default lobbyHandlerMappings;
