import net from 'net';
import { config } from './config/config';

const TOTAL_LENGTH = 4; // 전체 길이를 나타내는 4바이트
const PACKET_TYPE_LENGTH = 1; // 패킷타입을 나타내는 1바이트

// 헤더 읽기 함수
const readHeader = (buffer: Buffer): { length: number; packetType: number } => {
  return {
    length: buffer.readUInt16BE(0),
    packetType: buffer.readUInt16BE(config.packet.sizeOfSize),
  };
};

const writeHeader = (length: number, packetType: number): Buffer => {
  const buffer = Buffer.alloc(config.packet.sizeOfHeader);
  buffer.writeUInt16BE(length + config.packet.sizeOfHeader, 0);
  buffer.writeUInt16BE(packetType, config.packet.sizeOfId);
  return buffer;
};

// 서버에 연결할 호스트와 포트
const HOST = 'localhost';
const PORT = 3000;

const client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log('Connected to server');

  const message = 'Hi, There!';
  const test = Buffer.from(message);

  const header = writeHeader(test.length, 11);
  const packet = Buffer.concat([header, test]);
  client.write(packet);
});

client.on('data', (data: Buffer) => {
  const buffer = Buffer.from(data); // 버퍼 객체의 메서드를 사용하기 위해 변환

  // 헤더 읽기
  const { packetType, length } = readHeader(buffer);
  console.log(`packetType: ${packetType}`);
  console.log(`length: ${length}`);

  // 메시지 추출
  const message = buffer.slice(config.packet.sizeOfHeader); // 앞의 헤더 부분을 잘라낸다.
  console.log(`server 에게 받은 메세지: ${message.toString()}`);
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err: Error) => {
  console.error('Client error:', err);
});
