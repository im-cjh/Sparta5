import { Socket } from 'net';

export const onError = (socket: Socket) => (error: any) => {
  console.error('소켓 오류:', error);
};
