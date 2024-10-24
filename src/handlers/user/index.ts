import { Socket } from 'node:net';
import { ePacketId } from '../../constants/packetId';
import { handlePos } from '../startGame.handler';
import initialHandler from './initial.handler';
import { Session } from '../../session/session';
import defaultHandler from '../Default.handler';

//unknown이 최신일까?
type PacketHandler = (buffer: Buffer, session: Session) => unknown;

const handlerMappings: { [key in ePacketId]: PacketHandler } = {
  [ePacketId.C2S_Init]: (buffer: Buffer, session: Session) => initialHandler(buffer, session),
  [ePacketId.S2C_Init]: (buffer: Buffer, session: Session) => defaultHandler(buffer, session),
  [ePacketId.S2C_Error]: (buffer: Buffer, session: Session) => defaultHandler(buffer, session),
};

export default handlerMappings;
