import { create } from '@bufbuild/protobuf';
import { S2C_ErrorSchema, S2C_MetaDataSchema } from '../../common/protobuf/response/response_pb';
import { RESPONSE_SUCCESS_CODE } from '../../constants/packetId';
import { Session } from '../../session/session';

export class ResponseUtils {
  static createMetaResponse(responseCode: number) {
    const ret = create(S2C_MetaDataSchema, {
      timestamp: BigInt(Date.now()),
      responseCode: responseCode,
    });

    return ret;
  }
  static createErrorResponse(responseCode: number, message: string) {
    const ret = create(S2C_ErrorSchema, {
      meta: ResponseUtils.createMetaResponse(responseCode),
      message,
    });

    return ret;
  }
}
