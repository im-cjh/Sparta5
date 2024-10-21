import { ePacketId } from '../classes/packet';
import { startGame } from './startGame.handler';

//unknown이 최신일까?
type PacketHandler = (buffer: Buffer) => unknown;

export const handlerMappings: { [key in ePacketId]: PacketHandler } = {
  [ePacketId.RecoverGameState]: startGame, //임시로 사용
};

export default handlerMappings;
