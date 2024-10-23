import { Socket } from 'net';
import { sessionManager } from '../classes/managers/SessionManager';

export const onConnection = (socket: Socket): void => {
  console.log('클라이언트가 연결되었습니다:', socket.remoteAddress, socket.remotePort);

  sessionManager.addSession(socket);
  // 필요한 추가 작업 가능
};
