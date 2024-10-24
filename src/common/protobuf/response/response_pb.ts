// @generated by protoc-gen-es v2.2.0 with parameter "target=ts"
// @generated from file common/protobuf/response/response.proto (package response, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file common/protobuf/response/response.proto.
 */
export const file_common_protobuf_response_response: GenFile = /*@__PURE__*/
  fileDesc("Cidjb21tb24vcHJvdG9idWYvcmVzcG9uc2UvcmVzcG9uc2UucHJvdG8SCHJlc3BvbnNlIjcKDFMyQ19NZXRhRGF0YRIUCgxyZXNwb25zZUNvZGUYASABKA0SEQoJdGltZXN0YW1wGAIgASgDIkAKCFMyQ19Jbml0EiQKBG1ldGEYASABKAsyFi5yZXNwb25zZS5TMkNfTWV0YURhdGESDgoGdXNlcklkGAIgASgJIkIKCVMyQ19FcnJvchIkCgRtZXRhGAEgASgLMhYucmVzcG9uc2UuUzJDX01ldGFEYXRhEg8KB21lc3NhZ2UYAiABKAliBnByb3RvMw");

/**
 * 공통 응답 메시지 구조
 *
 * @generated from message response.S2C_MetaData
 */
export type S2C_MetaData = Message<"response.S2C_MetaData"> & {
  /**
   * 응답 코드 (성공: 0, 실패: 에러 코드)
   *
   * @generated from field: uint32 responseCode = 1;
   */
  responseCode: number;

  /**
   * 메시지 생성 타임스탬프 (Unix 타임스탬프)
   *
   * @generated from field: int64 timestamp = 2;
   */
  timestamp: bigint;
};

/**
 * Describes the message response.S2C_MetaData.
 * Use `create(S2C_MetaDataSchema)` to create a new message.
 */
export const S2C_MetaDataSchema: GenMessage<S2C_MetaData> = /*@__PURE__*/
  messageDesc(file_common_protobuf_response_response, 0);

/**
 * 유저 정보 응답 메시지
 *
 * @generated from message response.S2C_Init
 */
export type S2C_Init = Message<"response.S2C_Init"> & {
  /**
   * 공통 메타 데이터 (응답 코드, 타임스탬프, 시퀀스)
   *
   * @generated from field: response.S2C_MetaData meta = 1;
   */
  meta?: S2C_MetaData;

  /**
   * 유저 ID (UUID, 16바이트)
   *
   * @generated from field: string userId = 2;
   */
  userId: string;
};

/**
 * Describes the message response.S2C_Init.
 * Use `create(S2C_InitSchema)` to create a new message.
 */
export const S2C_InitSchema: GenMessage<S2C_Init> = /*@__PURE__*/
  messageDesc(file_common_protobuf_response_response, 1);

/**
 * 에러 응답 메시지
 *
 * @generated from message response.S2C_Error
 */
export type S2C_Error = Message<"response.S2C_Error"> & {
  /**
   * 공통 메타 데이터 (응답 코드, 타임스탬프, 시퀀스)
   *
   * @generated from field: response.S2C_MetaData meta = 1;
   */
  meta?: S2C_MetaData;

  /**
   * 에러 내용
   *
   * @generated from field: string message = 2;
   */
  message: string;
};

/**
 * Describes the message response.S2C_Error.
 * Use `create(S2C_ErrorSchema)` to create a new message.
 */
export const S2C_ErrorSchema: GenMessage<S2C_Error> = /*@__PURE__*/
  messageDesc(file_common_protobuf_response_response, 2);

