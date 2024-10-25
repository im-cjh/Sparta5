import { Socket } from 'node:net';
import { ePacketId } from '../../constants/packetId';
import initialHandler from './initial.handler';
import { Session } from '../../session/session';
import defaultHandler from '../default.handler';
import { roomManager } from '../../classes/managers/RoomManager';

type PacketHandler = (buffer: Buffer, session: Session) => unknown;

const handlerMappings: Record<ePacketId, PacketHandler> = {
  [ePacketId.C2S_Init]: (buffer: Buffer, session: Session) => initialHandler(buffer, session),
  [ePacketId.S2C_Init]: (buffer: Buffer, session: Session) => defaultHandler(buffer, session),
  [ePacketId.S2C_Error]: (buffer: Buffer, session: Session) => defaultHandler(buffer, session),
  [ePacketId.C2S_EnterRoom]: (buffer: Buffer, session: Session) => defaultHandler(buffer, session),
  [ePacketId.S2C_EnterRoom]: (buffer: Buffer, session: Session) => roomManager.enterRoomHandler(buffer, session),
};

export default handlerMappings;
