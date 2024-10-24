import { Socket } from 'net';
import { sessionManager } from '../../classes/managers/SessionManager';

import { create, fromBinary } from '@bufbuild/protobuf';
import { ePacketId, RESPONSE_SUCCESS_CODE } from '../../constants/packetId';
import { ParserUtils } from '../../utils/parser/ParserUtils';
import { S2C_Init, S2C_InitSchema, S2C_MetaDataSchema } from '../../common/protobuf/response/response_pb';
import { C2S_InitialPacketSchema } from '../../common/protobuf/request/initial_pb';
import { Session } from '../../session/session';
import { ResponseUtils } from '../../utils/response/responseUtils';

//payload란 이름 수정할 것
//버퍼엔 클라의 deviceID가 담겨있음
const initialHandler = async (buffer: Buffer, session: Session) => {
  const packet = fromBinary(C2S_InitialPacketSchema, buffer);
  session.setId(packet.deviceId);

  // 유저 정보 응답 생성
  const initPacket: S2C_Init = create(S2C_InitSchema, {
    meta: ResponseUtils.createMetaResponse(RESPONSE_SUCCESS_CODE),
    userId: packet.deviceId,
  });

  console.log('packet: ', packet);
  const sendBuffer: Buffer = ParserUtils.SerializePacket<S2C_Init>(
    initPacket,
    S2C_InitSchema,
    ePacketId.S2C_Init,
    session.getNextSequence(),
  );
  // 소켓을 통해 클라이언트에게 응답 메시지 전송
  session.send(sendBuffer);
};

export default initialHandler;
