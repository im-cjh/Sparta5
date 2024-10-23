import { Packet } from '../../Protocol/request/common_pb';
import { ePacketId } from '../constants/packetHeader';
import { ParserUtils } from '../utils/parser/ParserUtils';
import { startGame } from './startGame.handler';

//unknown이 최신일까?
type PacketHandler = (buffer: Buffer) => unknown;

export const handlerMappings: { [key in ePacketId]: PacketHandler } = {
  [ePacketId.NORMAL]: (buffer) => ParserUtils.packetParse(buffer),
};

// export default handlerMappings;
