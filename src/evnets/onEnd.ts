import { Socket } from 'net';

export const onEnd = (socket: Socket) => () => {
  console.log('클라이언트 연결이 종료되었습니다.');
};
