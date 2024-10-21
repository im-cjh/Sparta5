import { Socket } from 'net';
import { Session } from '../classes/session';
import { sessionManager } from '../classes/sessionManager';

export const onConnection = (socket: Socket) => {
  console.log('클라이언트가 연결되었습니다:', socket.remoteAddress, socket.remotePort);

  sessionManager.addSession(socket);
  // 필요한 추가 작업 가능
};
