import { create } from '@bufbuild/protobuf';
import { S2C_Error, S2C_ErrorSchema, S2C_MetaData, S2C_MetaDataSchema } from '../../common/protobuf/response/response_pb';
import { RESPONSE_SUCCESS_CODE } from '../../constants/packetId';
import { Session } from '../../session/session';
import { ObjectInfo, ObjectInfoSchema, PosInfo, PosInfoSchema } from '../../common/protobuf/struct_pb';
import { ObjectType } from '../../common/protobuf/enum_pb';
import { S2C_ENTER_ROOM, S2C_ENTER_ROOMSchema } from '../../common/protobuf/response/contents_pb';

export class ResponseUtils {
  static createMetaResponse(responseCode: number): S2C_MetaData {
    const ret: S2C_MetaData = create(S2C_MetaDataSchema, {
      timestamp: BigInt(Date.now()),
      responseCode: responseCode,
    });

    return ret;
  }
  static createErrorResponse(responseCode: number, message: string): S2C_Error {
    const ret: S2C_Error = create(S2C_ErrorSchema, {
      meta: ResponseUtils.createMetaResponse(responseCode),
      message,
    });

    return ret;
  }

  private static createPosInfo(pos: { x: number; y: number }, uuid: string): PosInfo {
    const ret: PosInfo = create(PosInfoSchema, {
      x: pos.x,
      y: pos.y,
      objectId: uuid,
    });

    return ret;
  }

  private static createPlayerInfo(pos: { x: number; y: number }, uuid: string): ObjectInfo {
    const ret: ObjectInfo = create(ObjectInfoSchema, {
      objectType: ObjectType.CREATURE,
      posInfo: ResponseUtils.createPosInfo(pos, uuid),
    });

    return ret;
  }

  static createEnterGameResponse(pos: { x: number; y: number }, uuid: string) {
    const ret: S2C_ENTER_ROOM = create(S2C_ENTER_ROOMSchema, {
      meta: ResponseUtils.createMetaResponse(RESPONSE_SUCCESS_CODE),
      player: ResponseUtils.createPlayerInfo(pos, uuid),
    });

    return ret;
  }
}
