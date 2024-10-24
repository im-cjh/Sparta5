// @generated by protoc-gen-es v2.2.0 with parameter "target=ts"
// @generated from file common/protobuf/request/initial.proto (package initial, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { C2S_MetaData } from "./common_pb";
import { file_common_protobuf_request_common } from "./common_pb";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file common/protobuf/request/initial.proto.
 */
export const file_common_protobuf_request_initial: GenFile = /*@__PURE__*/
  fileDesc("CiVjb21tb24vcHJvdG9idWYvcmVxdWVzdC9pbml0aWFsLnByb3RvEgdpbml0aWFsIkkKEUMyU19Jbml0aWFsUGFja2V0EiIKBG1ldGEYASABKAsyFC5jb21tb24uQzJTX01ldGFEYXRhEhAKCGRldmljZUlkGAIgASgJYgZwcm90bzM", [file_common_protobuf_request_common]);

/**
 * 최초 패킷 구조
 *
 * @generated from message initial.C2S_InitialPacket
 */
export type C2S_InitialPacket = Message<"initial.C2S_InitialPacket"> & {
  /**
   * @generated from field: common.C2S_MetaData meta = 1;
   */
  meta?: C2S_MetaData;

  /**
   * @generated from field: string deviceId = 2;
   */
  deviceId: string;
};

/**
 * Describes the message initial.C2S_InitialPacket.
 * Use `create(C2S_InitialPacketSchema)` to create a new message.
 */
export const C2S_InitialPacketSchema: GenMessage<C2S_InitialPacket> = /*@__PURE__*/
  messageDesc(file_common_protobuf_request_initial, 0);

