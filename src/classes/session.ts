import { Socket } from 'net';
import { onData } from '../evnets/onData';
import { onEnd } from '../evnets/onEnd';
import { onError } from '../evnets/onError';
import { config } from '../config/config';

export class Session {
  /*---------------------------------------------
    [멤버 변수]
---------------------------------------------*/
  private socket: Socket;
  private buffer: Buffer;
  /*---------------------------------------------
    [생성자]
---------------------------------------------*/
  constructor(socket: Socket) {
    this.socket = socket;
    this.buffer = Buffer.alloc(0);

    this.socket.on('data', onData(this.socket));
    this.socket.on('end', onEnd(this.socket));
    this.socket.on('error', onError(this.socket));
  }

  //private onData(socket: Socket) => async (data: Buffer) => {
    private OnRecv(buffer: Buffer, len: number): number
	{
		INT32 processLen = 0;

		while (true)
		{
			INT32 dataSize = len - processLen;
			//최소한 헤더는 파싱할 수 있어야 한다
			if (dataSize < sizeof(PacketHeader))
				break;

			PacketHeader header = *(reinterpret_cast<PacketHeader*>(&buffer[processLen]));
			// 헤더에 기록된 패킷 크기를 파싱할 수 있어야 한다
			if (dataSize < header.size)
				break;

			//패킷 조립 성공
			HandlePacket(&buffer[processLen], header.size, (ePacketID)header.id);

			processLen += header.size;
		}

		return processLen;
	}
}
