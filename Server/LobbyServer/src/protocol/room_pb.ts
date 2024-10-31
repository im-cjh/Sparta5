// @generated by protoc-gen-es v2.2.1 with parameter "target=ts"
// @generated from file room.proto (package Protocol, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { C2S_Metadata } from "./client_pb";
import { file_client } from "./client_pb";
import type { S2C_Metadata } from "./server_pb";
import { file_server } from "./server_pb";
import type { RoomInfo, UserInfo } from "./struct_pb";
import { file_struct } from "./struct_pb";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file room.proto.
 */
export const file_room: GenFile = /*@__PURE__*/
  fileDesc("Cgpyb29tLnByb3RvEghQcm90b2NvbCJFCg1DMkxfRW50ZXJSb29tEiQKBG1ldGEYASABKAsyFi5Qcm90b2NvbC5DMlNfTWV0YWRhdGESDgoGcm9vbUlkGAIgASgNIn0KD0wyQ19FbnRlclJvb21NZRIkCgRtZXRhGAEgASgLMhYuUHJvdG9jb2wuUzJDX01ldGFkYXRhEhEKCWlzRW50ZXJlZBgCIAEoCBIhCgV1c2VycxgDIAMoCzISLlByb3RvY29sLlVzZXJJbmZvEg4KBnJvb21JZBgEIAEoDSJfChJMMkNfRW50ZXJSb29tT3RoZXISJAoEbWV0YRgBIAEoCzIWLlByb3RvY29sLlMyQ19NZXRhZGF0YRIjCgduZXdVc2VyGAIgASgLMhIuUHJvdG9jb2wuVXNlckluZm8iVQoNQzJMX0xlYXZlUm9vbRIkCgRtZXRhGAEgASgLMhYuUHJvdG9jb2wuQzJTX01ldGFkYXRhEg4KBnJvb21JZBgCIAEoDRIOCgZ1c2VySWQYAyABKAkiNwoPTDJDX0xlYXZlUm9vbU1lEiQKBG1ldGEYASABKAsyFi5Qcm90b2NvbC5TMkNfTWV0YWRhdGEiSgoSTDJDX0xlYXZlUm9vbU90aGVyEiQKBG1ldGEYASABKAsyFi5Qcm90b2NvbC5TMkNfTWV0YWRhdGESDgoGdXNlcklkGAIgASgJIjQKDEMyTF9Sb29tTGlzdBIkCgRtZXRhGAEgASgLMhYuUHJvdG9jb2wuQzJTX01ldGFkYXRhIlcKDEwyQ19Sb29tTGlzdBIkCgRtZXRhGAEgASgLMhYuUHJvdG9jb2wuUzJDX01ldGFkYXRhEiEKBXJvb21zGAIgAygLMhIuUHJvdG9jb2wuUm9vbUluZm8iWQoNQzJMX0dhbWVTdGFydBIkCgRtZXRhGAEgASgLMhYuUHJvdG9jb2wuQzJTX01ldGFkYXRhEg4KBnJvb21JZBgCIAEoDRISCgptYXhQbGF5ZXJzGAMgASgNIlEKDUwyQ19HYW1lU3RhcnQSJAoEbWV0YRgBIAEoCzIWLlByb3RvY29sLlMyQ19NZXRhZGF0YRIMCgRob3N0GAIgASgJEgwKBHBvcnQYAyABKA0iNAoOTDJCX0NyZWF0ZVJvb20SDgoGcm9vbUlkGAEgASgNEhIKCm1heFBsYXllcnMYAiABKA0iIwoOQjJMX0NyZWF0ZVJvb20SEQoJaXNDcmVhdGVkGAEgASgIYgZwcm90bzM", [file_client, file_server, file_struct]);

/**
 * 방 입장 요청 패킷
 *
 * @generated from message Protocol.C2L_EnterRoom
 */
export type C2L_EnterRoom = Message<"Protocol.C2L_EnterRoom"> & {
  /**
   * @generated from field: Protocol.C2S_Metadata meta = 1;
   */
  meta?: C2S_Metadata;

  /**
   * 입장하려는 Room ID
   *
   * @generated from field: uint32 roomId = 2;
   */
  roomId: number;
};

/**
 * Describes the message Protocol.C2L_EnterRoom.
 * Use `create(C2L_EnterRoomSchema)` to create a new message.
 */
export const C2L_EnterRoomSchema: GenMessage<C2L_EnterRoom> = /*@__PURE__*/
  messageDesc(file_room, 0);

/**
 * 방 입장 응답 패킷(내가 입장)
 *
 * @generated from message Protocol.L2C_EnterRoomMe
 */
export type L2C_EnterRoomMe = Message<"Protocol.L2C_EnterRoomMe"> & {
  /**
   * 공통 응답 메타 데이터
   *
   * @generated from field: Protocol.S2C_Metadata meta = 1;
   */
  meta?: S2C_Metadata;

  /**
   * 방 입장 성공 여부
   *
   * @generated from field: bool isEntered = 2;
   */
  isEntered: boolean;

  /**
   * 방에 있는 기존 유저 정보
   *
   * @generated from field: repeated Protocol.UserInfo users = 3;
   */
  users: UserInfo[];

  /**
   * @generated from field: uint32 roomId = 4;
   */
  roomId: number;
};

/**
 * Describes the message Protocol.L2C_EnterRoomMe.
 * Use `create(L2C_EnterRoomMeSchema)` to create a new message.
 */
export const L2C_EnterRoomMeSchema: GenMessage<L2C_EnterRoomMe> = /*@__PURE__*/
  messageDesc(file_room, 1);

/**
 * 방 입장 응답 패킷(남이 입장)
 *
 * @generated from message Protocol.L2C_EnterRoomOther
 */
export type L2C_EnterRoomOther = Message<"Protocol.L2C_EnterRoomOther"> & {
  /**
   * 공통 응답 메타 데이터
   *
   * @generated from field: Protocol.S2C_Metadata meta = 1;
   */
  meta?: S2C_Metadata;

  /**
   * 신규 유저 정보
   *
   * @generated from field: Protocol.UserInfo newUser = 2;
   */
  newUser?: UserInfo;
};

/**
 * Describes the message Protocol.L2C_EnterRoomOther.
 * Use `create(L2C_EnterRoomOtherSchema)` to create a new message.
 */
export const L2C_EnterRoomOtherSchema: GenMessage<L2C_EnterRoomOther> = /*@__PURE__*/
  messageDesc(file_room, 2);

/**
 * @generated from message Protocol.C2L_LeaveRoom
 */
export type C2L_LeaveRoom = Message<"Protocol.C2L_LeaveRoom"> & {
  /**
   * @generated from field: Protocol.C2S_Metadata meta = 1;
   */
  meta?: C2S_Metadata;

  /**
   * @generated from field: uint32 roomId = 2;
   */
  roomId: number;

  /**
   * @generated from field: string userId = 3;
   */
  userId: string;
};

/**
 * Describes the message Protocol.C2L_LeaveRoom.
 * Use `create(C2L_LeaveRoomSchema)` to create a new message.
 */
export const C2L_LeaveRoomSchema: GenMessage<C2L_LeaveRoom> = /*@__PURE__*/
  messageDesc(file_room, 3);

/**
 * @generated from message Protocol.L2C_LeaveRoomMe
 */
export type L2C_LeaveRoomMe = Message<"Protocol.L2C_LeaveRoomMe"> & {
  /**
   * 공통 응답 메타 데이터
   *
   * @generated from field: Protocol.S2C_Metadata meta = 1;
   */
  meta?: S2C_Metadata;
};

/**
 * Describes the message Protocol.L2C_LeaveRoomMe.
 * Use `create(L2C_LeaveRoomMeSchema)` to create a new message.
 */
export const L2C_LeaveRoomMeSchema: GenMessage<L2C_LeaveRoomMe> = /*@__PURE__*/
  messageDesc(file_room, 4);

/**
 * @generated from message Protocol.L2C_LeaveRoomOther
 */
export type L2C_LeaveRoomOther = Message<"Protocol.L2C_LeaveRoomOther"> & {
  /**
   * 공통 응답 메타 데이터
   *
   * @generated from field: Protocol.S2C_Metadata meta = 1;
   */
  meta?: S2C_Metadata;

  /**
   * @generated from field: string userId = 2;
   */
  userId: string;
};

/**
 * Describes the message Protocol.L2C_LeaveRoomOther.
 * Use `create(L2C_LeaveRoomOtherSchema)` to create a new message.
 */
export const L2C_LeaveRoomOtherSchema: GenMessage<L2C_LeaveRoomOther> = /*@__PURE__*/
  messageDesc(file_room, 5);

/**
 * @generated from message Protocol.C2L_RoomList
 */
export type C2L_RoomList = Message<"Protocol.C2L_RoomList"> & {
  /**
   * @generated from field: Protocol.C2S_Metadata meta = 1;
   */
  meta?: C2S_Metadata;
};

/**
 * Describes the message Protocol.C2L_RoomList.
 * Use `create(C2L_RoomListSchema)` to create a new message.
 */
export const C2L_RoomListSchema: GenMessage<C2L_RoomList> = /*@__PURE__*/
  messageDesc(file_room, 6);

/**
 * @generated from message Protocol.L2C_RoomList
 */
export type L2C_RoomList = Message<"Protocol.L2C_RoomList"> & {
  /**
   * 공통 응답 메타 데이터
   *
   * @generated from field: Protocol.S2C_Metadata meta = 1;
   */
  meta?: S2C_Metadata;

  /**
   * 방 목록
   *
   * @generated from field: repeated Protocol.RoomInfo rooms = 2;
   */
  rooms: RoomInfo[];
};

/**
 * Describes the message Protocol.L2C_RoomList.
 * Use `create(L2C_RoomListSchema)` to create a new message.
 */
export const L2C_RoomListSchema: GenMessage<L2C_RoomList> = /*@__PURE__*/
  messageDesc(file_room, 7);

/**
 * @generated from message Protocol.C2L_GameStart
 */
export type C2L_GameStart = Message<"Protocol.C2L_GameStart"> & {
  /**
   * @generated from field: Protocol.C2S_Metadata meta = 1;
   */
  meta?: C2S_Metadata;

  /**
   * 입장하려는 Room ID
   *
   * @generated from field: uint32 roomId = 2;
   */
  roomId: number;

  /**
   * @generated from field: uint32 maxPlayers = 3;
   */
  maxPlayers: number;
};

/**
 * Describes the message Protocol.C2L_GameStart.
 * Use `create(C2L_GameStartSchema)` to create a new message.
 */
export const C2L_GameStartSchema: GenMessage<C2L_GameStart> = /*@__PURE__*/
  messageDesc(file_room, 8);

/**
 * @generated from message Protocol.L2C_GameStart
 */
export type L2C_GameStart = Message<"Protocol.L2C_GameStart"> & {
  /**
   * 공통 응답 메타 데이터
   *
   * @generated from field: Protocol.S2C_Metadata meta = 1;
   */
  meta?: S2C_Metadata;

  /**
   * ex: localhost
   *
   * @generated from field: string host = 2;
   */
  host: string;

  /**
   * 포트번호
   *
   * @generated from field: uint32 port = 3;
   */
  port: number;
};

/**
 * Describes the message Protocol.L2C_GameStart.
 * Use `create(L2C_GameStartSchema)` to create a new message.
 */
export const L2C_GameStartSchema: GenMessage<L2C_GameStart> = /*@__PURE__*/
  messageDesc(file_room, 9);

/**
 * @generated from message Protocol.L2B_CreateRoom
 */
export type L2B_CreateRoom = Message<"Protocol.L2B_CreateRoom"> & {
  /**
   * @generated from field: uint32 roomId = 1;
   */
  roomId: number;

  /**
   * @generated from field: uint32 maxPlayers = 2;
   */
  maxPlayers: number;
};

/**
 * Describes the message Protocol.L2B_CreateRoom.
 * Use `create(L2B_CreateRoomSchema)` to create a new message.
 */
export const L2B_CreateRoomSchema: GenMessage<L2B_CreateRoom> = /*@__PURE__*/
  messageDesc(file_room, 10);

/**
 * @generated from message Protocol.B2L_CreateRoom
 */
export type B2L_CreateRoom = Message<"Protocol.B2L_CreateRoom"> & {
  /**
   * @generated from field: bool isCreated = 1;
   */
  isCreated: boolean;
};

/**
 * Describes the message Protocol.B2L_CreateRoom.
 * Use `create(B2L_CreateRoomSchema)` to create a new message.
 */
export const B2L_CreateRoomSchema: GenMessage<B2L_CreateRoom> = /*@__PURE__*/
  messageDesc(file_room, 11);

