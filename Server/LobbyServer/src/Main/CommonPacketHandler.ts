import { Socket } from 'net';
import { create, fromBinary } from '@bufbuild/protobuf';
import { LobbySession } from 'src/Main/LobbySession';
import { CustomError } from 'ServerCore/utils/error/CustomError';
import { ErrorCodes } from 'ServerCore/utils/error/ErrorCodes';
import { lobbyConfig } from 'src/config/config';
import { UserDb } from 'src/db/user/user.db';
import { ResponseUtils } from 'src/Utils/response/ResponseUtils';
import { PacketUtils } from 'ServerCore/utils/parser/ParserUtils';
import { ePacketId } from 'ServerCore/network/PacketId';
import { C2L_InitialPacket, C2L_InitialPacketSchema } from 'src/Protocol/client_pb';
import {
  B2L_InitialPacket,
  B2L_InitialPacketSchema,
  L2C_Init,
  L2C_InitSchema,
} from 'src/Protocol/server_pb';
import { battleSessionManager, sessionManager } from 'src/server';
import { PacketHeader } from 'ServerCore/network/PacketHeader';
import { config, RESPONSE_SUCCESS_CODE } from 'ServerCore/config/config';

export const onConnection = (socket: Socket): void => {
  console.log('새로운 연결이 감지되었습니다:', socket.remoteAddress, socket.remotePort);

  let buffer = Buffer.alloc(0);

  socket.on('data', (data: Buffer) => {
    buffer = Buffer.concat([buffer, data]);

    // 최소한 헤더는 파싱할 수 있어야 한다
    if (buffer.length < config.packet.sizeOfHeader) {
      return;
    }

    let header: PacketHeader = PacketUtils.readPacketHeader(buffer);
    // 헤더에 기록된 패킷 크기를 파싱할 수 있어야 한다
    if (buffer.length < header.size) {
      console.log('파싱X', buffer.length, header.size);
      return;
    }

    const packet = buffer.subarray(config.packet.sizeOfHeader, header.size);

    if (header.id == ePacketId.C2L_Init) {
      console.log('클라 접속');
      initialHandler(packet, socket, ePacketId.C2L_Init);
    } else if (header.id == ePacketId.B2L_Init) {
      console.log('배틀 서버 접속');
      initialHandler(packet, socket, ePacketId.B2L_Init);
    } else {
      console.log('먼지 모르겥는거 두두등장');
      socket.destroy();
    }
  });
};

/*---------------------------------------------
    [초기화 핸들러]

    1. 클라 버전 검증
    2. 유저 정보 갱신
        2-1. 최초 접속 시 DB에 저장
        2-2. 최초가 아니면 로그인 기록 갱신
    3. session의 유저 id 갱신
    4. 유저 정보 응답 생성
    5. 유저 정보 직렬화
    6. 버퍼 전송

    - 클라로부터 deviceId를 받기
    - DB 조회
        -데이터X: 새로운 id발급
        -데이터O: 기존 id반환

---------------------------------------------*/
const initialHandler = async (buffer: Buffer, socket: Socket, packetId: ePacketId) => {
  console.log('initialHandler: called');
  socket.removeAllListeners('data'); // 추가 청취자 제거

  //클라 접속
  if (packetId == ePacketId.C2L_Init) {
    let packet: C2L_InitialPacket;
    try {
      packet = fromBinary(C2L_InitialPacketSchema, buffer);
    } catch (error) {
      throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다');
    }

    //1. 클라 버전 검증
    if (packet.meta?.clientVersion !== lobbyConfig.client.version) {
      throw new CustomError(
        ErrorCodes.CLIENT_VERSION_MISMATCH,
        '클라이언트 버전이 일치하지 않습니다.',
      );
    }

    //2. 유저 정보 갱신
    let user = await UserDb.findUserByDeviceID(packet.meta.userId);
    if (!user) {
      //2-1. 최초 접속 시 DB에 저장
      user = await UserDb.createUser(packet.meta.userId);
    } else {
      //2-2. 최초가 아니면 로그인 기록 갱신
      UserDb.updateUserLogin(user.id);
    }

    //3. sessionManager에 로비세션 추가
    // 세션이 생성되었으므로, 더 이상 주체 판별이 필요하지 않음
    sessionManager.addSession(packet.meta.userId, socket);
    sessionManager.getSessionOrNull(packet.meta.userId)?.setNickname(packet.nickname);

    //4. 유저 정보 응답 생성
    const initPacket: L2C_Init = create(L2C_InitSchema, {
      meta: ResponseUtils.createMetaResponse(RESPONSE_SUCCESS_CODE),
      userId: packet.meta.userId,
    });

    //5. 유저 정보 직렬화
    const sendBuffer: Buffer = PacketUtils.SerializePacket<L2C_Init>(
      initPacket,
      L2C_InitSchema,
      ePacketId.L2C_Init,
      sessionManager.getSessionOrNull(packet.meta.userId)?.getNextSequence() || 0,
    );
    //5. 버퍼 전송
    console.log('Serialized sendBuffer length:', sendBuffer.length);
    sessionManager.getSessionOrNull(packet.meta.userId)?.send(sendBuffer);
  }
  //배틀 서버 접속
  else if (packetId == ePacketId.B2L_Init) {
    let packet: B2L_InitialPacket;
    try {
      packet = fromBinary(B2L_InitialPacketSchema, buffer);
    } catch (error) {
      throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다');
    }
    battleSessionManager.addSession(packet.serverId, socket);
  }
};

export default initialHandler;
