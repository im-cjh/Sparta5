// @generated by protoc-gen-es v2.2.0 with parameter "target=ts"
// @generated from file client.proto (package Protocol, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file client.proto.
 */
export const file_client: GenFile = /*@__PURE__*/
  fileDesc("CgxjbGllbnQucHJvdG8SCFByb3RvY29sIjUKDEMyU19NZXRhZGF0YRIOCgZ1c2VySWQYASABKAkSFQoNY2xpZW50VmVyc2lvbhgCIAEoCSJuChFDMkxfSW5pdGlhbFBhY2tldBIkCgRtZXRhGAEgASgLMhYuUHJvdG9jb2wuQzJTX01ldGFkYXRhEhAKCHBsYXllcklkGAIgASgNEg8KB2xhdGVuY3kYAyABKAISEAoIbmlja25hbWUYBCABKAliBnByb3RvMw");

/**
 * 공통 요청 메시지 구조
 *
 * @generated from message Protocol.C2S_Metadata
 */
export type C2S_Metadata = Message<"Protocol.C2S_Metadata"> & {
  /**
   * 유저 ID (UUID, 16바이트)
   *
   * @generated from field: string userId = 1;
   */
  userId: string;

  /**
   * 클라이언트 버전 (문자열)
   *
   * @generated from field: string clientVersion = 2;
   */
  clientVersion: string;
};

/**
 * Describes the message Protocol.C2S_Metadata.
 * Use `create(C2S_MetadataSchema)` to create a new message.
 */
export const C2S_MetadataSchema: GenMessage<C2S_Metadata> = /*@__PURE__*/
  messageDesc(file_client, 0);

/**
 * 최초 패킷 구조
 *
 * @generated from message Protocol.C2L_InitialPacket
 */
export type C2L_InitialPacket = Message<"Protocol.C2L_InitialPacket"> & {
  /**
   * @generated from field: Protocol.C2S_Metadata meta = 1;
   */
  meta?: C2S_Metadata;

  /**
   * @generated from field: uint32 playerId = 2;
   */
  playerId: number;

  /**
   * @generated from field: float latency = 3;
   */
  latency: number;

  /**
   * @generated from field: string nickname = 4;
   */
  nickname: string;
};

/**
 * Describes the message Protocol.C2L_InitialPacket.
 * Use `create(C2L_InitialPacketSchema)` to create a new message.
 */
export const C2L_InitialPacketSchema: GenMessage<C2L_InitialPacket> = /*@__PURE__*/
  messageDesc(file_client, 1);

