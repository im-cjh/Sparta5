import { ePacketId } from '../../constants/packetId';
import { handlePos } from '../startGame.handler';

//unknown이 최신일까?
type PacketHandler = (buffer: Buffer) => unknown;

const handlerMappings: { [key in ePacketId]: PacketHandler } = {
  [ePacketId.NORMAL]: (buffer) => handlePos(buffer),
};

export default handlerMappings;
