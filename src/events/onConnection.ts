import { Socket } from 'net';
import { sessionManager } from '../classes/managers/SessionManager';
import { v4 as uuidv4 } from 'uuid';

export const onConnection = (socket: Socket): void => {
  console.log('클라이언트가 연결되었습니다:', socket.remoteAddress, socket.remotePort);

  const userId = uuidv4();
  sessionManager.addSession(socket, userId);
  // 필요한 추가 작업 가능
};
