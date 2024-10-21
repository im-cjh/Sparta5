import { UUID } from 'node:crypto';
import { ePacketId } from '../constants/header';

export const startGame = async (buffer: Buffer) => {
  //임시
  return {
    status: 'success',
    //packetId: ePacketId.RecoverGameState,
    payload: 'tmp',
  };
};
