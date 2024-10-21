import { Socket } from 'net';
import { onData } from './onData';
import { onEnd } from './onEnd';
import { onError } from './onError';
import { Session } from '../classes/session';
import { sessionManager } from '../classes/sessionManager';

export const onConnection = (socket: Socket) => {
  console.log('클라이언트가 연결되었습니다:', socket.remoteAddress, socket.remotePort);

  sessionManager.addSession(socket);

  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
