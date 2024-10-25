import { Socket } from 'net';
import { sessionManager } from '../../classes/managers/SessionManager';

import { create, fromBinary } from '@bufbuild/protobuf';
import { ePacketId, RESPONSE_SUCCESS_CODE } from '../../constants/packetId';
import { ParserUtils } from '../../utils/parser/ParserUtils';
import { S2C_Init, S2C_InitSchema, S2C_MetaDataSchema } from '../../common/protobuf/response/response_pb';
import { C2S_InitialPacket, C2S_InitialPacketSchema } from '../../common/protobuf/request/initial_pb';
import { Session } from '../../session/session';
import { ResponseUtils } from '../../utils/response/responseUtils';
import CustomError from '../../utils/error/CustomeError';
import { handleError } from '../../utils/error/errorHandler';
import { ErrorCodes } from '../../utils/error/ErrorCodes';
import { config } from '../../config/config';
import { UserDb } from '../../db/user/user.db';

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
const initialHandler = async (buffer: Buffer, session: Session) => {
  let packet: C2S_InitialPacket;
  try {
    packet = fromBinary(C2S_InitialPacketSchema, buffer);
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다');
  }

  //1. 클라 버전 검증
  if (packet.meta?.clientVersion !== config.client.version) {
    throw new CustomError(ErrorCodes.CLIENT_VERSION_MISMATCH, '클라이언트 버전이 일치하지 않습니다.');
  }

  //2. 유저 정보 갱신
  const user = await UserDb.findUserByDeviceID(packet.deviceId);
  if (!user) {
    //2-1. 최초 접속 시 DB에 저장
    await UserDb.createUser(packet.deviceId);
  } else {
    //2-2. 최초가 아니면 로그인 기록 갱신
    UserDb.updateUserLogin(user.id);
  }

  //3. session의 유저 id 갱신
  session.setId(user.id);
  //3. 유저 정보 응답 생성
  const initPacket: S2C_Init = create(S2C_InitSchema, {
    meta: ResponseUtils.createMetaResponse(RESPONSE_SUCCESS_CODE),
    userId: packet.deviceId,
  });

  //4. 유저 정보 직렬화
  const sendBuffer: Buffer = ParserUtils.SerializePacket<S2C_Init>(
    initPacket,
    S2C_InitSchema,
    ePacketId.S2C_Init,
    session.getNextSequence(),
  );
  //5. 버퍼 전송
  session.send(sendBuffer);
};

export default initialHandler;
