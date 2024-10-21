import { Socket } from 'net';
import { config } from '../config/config';
import { ePacketId, PacketHeader } from './packet';
import { Utils } from '../utils/utils';
import handlerMappings from '../Handlers/handlerMapping';

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

    this.init();
  }

  /*---------------------------------------------
    [소켓 이벤트 설정]
    1. data: 요청을 처리하거나 응답을 준비
    2. end: 자원을 정리하거나 로그를 남기기
    3. error: 예외 상황을 적절히 처리하고 로그를 남기거나 대응을 하기
---------------------------------------------*/
  init() {
    this.socket.on('data', (data: Buffer) => this.onData(data));
    this.socket.on('end', () => this.onEnd());
    this.socket.on('error', (error: any) => this.onError(error));
  }

  /*---------------------------------------------
    [onData]
    - 발생 조건: 클라이언트로부터 데이터가 수신될 때 
    - 목적: 요청을 처리하거나 응답을 준비

    1. 수신한 버퍼와 기존의 버퍼를 합치기
    2. 온전한 패킷을 수신했는지 확인
        2-1. 아직 덜 도착했다면 break
    3. 패킷의 크기만큼 버퍼를 줄이고, handler함수 호출
---------------------------------------------*/
  private onData(buffer: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, buffer]);

    while (true) {
      //최소한 헤더는 파싱할 수 있어야 한다
      if (this.buffer.length < config.packet.sizeOfHeader) break;

      let header: PacketHeader = Utils.readPacketHeader(this.buffer, 0);
      // 헤더에 기록된 패킷 크기를 파싱할 수 있어야 한다
      if (this.buffer.length < header.size) break;

      const packet = buffer.subarray(config.packet.sizeOfHeader, header.size);
      this.buffer = buffer.subarray(header.size);
      //패킷 조립 성공
      this.handlePacket(packet, header.id);
    }
  }

  /*---------------------------------------------
    [onEnd]
    - 발생 조건: 상대방이 FIN패킷을 보냈을 때 
    - 목적: 자원을 정리하거나 로그를 남기기
---------------------------------------------*/
  private onEnd(): void {
    console.log('클라이언트 연결이 종료되었습니다.');
  }

  /*---------------------------------------------
    [onError]
    - 발생 조건: 에러가 발생했을 때
    - 목적: 예외 상황을 적절히 처리하고 로그를 남기거나 대응을 하기
    
    - 이 이벤트 이후 곧바로 close이벤트 호출
---------------------------------------------*/
  private onError(error: any): void {
    console.error('소켓 오류:', error);
  }

  /*---------------------------------------------
    [handlePacket]
    - 목적: 수신한 패킷의 Id에 맞는 함수 호출
---------------------------------------------*/
  private async handlePacket(packet: Buffer, packetId: ePacketId) {
    // [TODO]
    // 1. 클라이언트 버전이 지원되는지 확인

    // [TODO];
    //2. 패킷 ID에 해당하는 핸들러 확인
    const handler = handlerMappings[packetId];

    // [TODO];
    //2-1. 핸들러가 존재하지 않을 경우 오류 처리

    //3. 핸들러를 호출하여 응답 생성
    const response = await handler(packet);

    // [TODO];
    //4. 클라이언트에 결과 전송
  }
}
