import { Socket } from 'net';
import { ErrorCodes } from './errorCodes';
import CustomError from './customeError';
import { Session } from '../../session/session';
import { ePacketId } from '../../constants/packetId';
import { S2C_Error, S2C_ErrorSchema, S2C_MetaDataSchema } from '../../common/protobuf/response/response_pb';
import { create } from '@bufbuild/protobuf';
import { ResponseUtils } from '../response/responseUtils';
import { ParserUtils } from '../parser/ParserUtils';

export const handleError = (session: Session, error: any) => {
  let responseCode: number;
  let message: string = error.message;
  console.log(error);
  if (error.code) {
    responseCode = error.code;
    console.error(`에러 코드: ${error.code}, 메시지: ${error.message}`);
  } else {
    responseCode = ErrorCodes.SOCKET_ERROR;
    console.error(`일반 에러: ${error.message}`);
  }

  const packet: S2C_Error = ResponseUtils.createErrorResponse(responseCode, message);
  const sendBuffer: Buffer = ParserUtils.SerializePacket<S2C_Error>(
    packet,
    S2C_ErrorSchema,
    ePacketId.S2C_Error,
    session.getNextSequence(),
  );
  session.send(sendBuffer);
};
