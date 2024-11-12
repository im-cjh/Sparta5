import { Socket } from 'node:net';
import defaultHandler from 'ServerCore/utils/default.handler';
import { LobbySession } from 'src/Main/LobbySession';
import { ePacketId } from 'ServerCore/network/PacketId';

import { BattleSession } from 'src/Main/BattleSession';
import { roomManager } from 'src/Game/RoomManager';

type PacketHandler = (buffer: Buffer, session: BattleSession) => void;

const battleHandlerMappings: Record<ePacketId, PacketHandler> | any = {
  [ePacketId.B2L_Init]: (buffer: Buffer, session: BattleSession) => defaultHandler(buffer, session),
  [ePacketId.B2L_CreateRoom]: (buffer: Buffer, session: BattleSession) =>
    roomManager.onGameStartHandler(buffer, session),
};

export default battleHandlerMappings;
