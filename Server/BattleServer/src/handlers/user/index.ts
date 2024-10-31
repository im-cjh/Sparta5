import { Socket } from 'node:net';
import defaultHandler from 'ServerCore/handlers/default.handler';
import { LobbySession } from 'src/network/LobbySession';
import { ePacketId } from 'ServerCore/network/PacketId';
import { BattleSession } from 'src/network/BattleSession';
import { gameRoomManager } from 'src/classes/managers/GameRoomManager';

type PacketHandler = (buffer: Buffer, session: BattleSession) => void;

const handlerMappings: Record<ePacketId, PacketHandler> | any = {
  [ePacketId.L2B_CreateRoom]: (buffer: Buffer, session: BattleSession) => gameRoomManager.createGameRoom(buffer, session),
  [ePacketId.L2B_Init]: (buffer: Buffer, session: BattleSession) => defaultHandler(buffer, session),
  [ePacketId.S2C_Error]: function (buffer: Buffer, session: BattleSession) {
    console.log('에러 ㅇㅇ');
  },
};

export default handlerMappings;
