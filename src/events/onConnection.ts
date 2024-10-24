import { Socket } from 'net';
import { sessionManager } from '../classes/managers/SessionManager';
import { Session } from '../session/session';

export const onConnection = (socket: Socket): void => {
  console.log('클라이언트가 연결되었습니다:', socket.remoteAddress, socket.remotePort);

  const session = new Session(socket);
};
