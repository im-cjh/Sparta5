import { Socket } from 'net';
import { create } from '@bufbuild/protobuf';
import { LobbySession } from 'src/network/LobbySession';

import { ResponseUtils } from '../response/ResponseUtils';
import { ErrorCodes } from 'ServerCore/utils/error/ErrorCodes';
import { PacketUtils } from 'ServerCore/utils/parser/ParserUtils';
import { ePacketId } from 'ServerCore/network/PacketId';
import { S2C_Error, S2C_ErrorSchema } from 'src/protocol/server_pb';
import { BattleSession } from 'src/network/BattleSession';

export const handleError = (session: LobbySession | BattleSession, error: any) => {
  let responseCode: number;
  let message: string = error.message;
  if (error.code) {
    responseCode = error.code;
    console.error(`에러 코드: ${error.code}, 메시지: ${error.message}`);
    console.log(error.stack.split('\n')[1]);
  } else {
    responseCode = ErrorCodes.SOCKET_ERROR;
    console.error(`일반 에러: ${error.message}`);
    console.log(error.stack.split('\n')[1]);
  }

  const packet: S2C_Error = ResponseUtils.createErrorResponse(responseCode, message);
  const sendBuffer: Buffer = PacketUtils.SerializePacket<S2C_Error>(packet, S2C_ErrorSchema, ePacketId.S2C_Error, session.getNextSequence());
  session.send(sendBuffer);
};
