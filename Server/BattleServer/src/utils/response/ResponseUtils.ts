import { create } from "@bufbuild/protobuf";
import {
  S2C_Error,
  S2C_ErrorSchema,
  S2C_Metadata,
  S2C_MetadataSchema,
} from "src/protocol/server_pb";

export class ResponseUtils {
  static createMetaResponse(responseCode: number): S2C_Metadata {
    const ret: S2C_Metadata = create(S2C_MetadataSchema, {
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
}
