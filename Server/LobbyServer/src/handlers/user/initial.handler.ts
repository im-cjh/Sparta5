import { Socket } from 'net';
import { create, fromBinary } from '@bufbuild/protobuf';
import { LobbySession } from 'src/network/LobbySession';
import { CustomError } from 'ServerCore/utils/error/CustomError';
import { ErrorCodes } from 'ServerCore/utils/error/ErrorCodes';
import { lobbyConfig } from 'src/config/config';
import { UserDb } from 'src/db/user/user.db';
import { ResponseUtils } from 'src/utils/response/ResponseUtils';
import { RESPONSE_SUCCESS_CODE } from 'ServerCore/constants';
import { PacketUtils } from 'ServerCore/utils/parser/ParserUtils';
import { ePacketId } from 'ServerCore/network/PacketId';
import { C2L_InitialPacket, C2L_InitialPacketSchema } from 'src/protocol/client_pb';
import {
  B2L_InitialPacket,
  B2L_InitialPacketSchema,
  L2C_Init,
  L2C_InitSchema,
} from 'src/protocol/server_pb';
import { battleSessionManager, sessionManager } from 'src/server';

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
    sessionManager.addSession(user.id, socket);
    sessionManager.getSessionOrNull(user.id)?.setNickname(packet.nickname);

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
      sessionManager.getSessionOrNull(user.id)?.getNextSequence() || 0,
    );
    //5. 버퍼 전송
    console.log('Serialized sendBuffer length:', sendBuffer.length);
    sessionManager.getSessionOrNull(user.id)?.send(sendBuffer);
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
