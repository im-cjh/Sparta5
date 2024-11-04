// @generated by protoc-gen-es v2.2.1 with parameter "target=ts"
// @generated from file game.proto (package Protocol, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import { file_client } from "./client_pb";
import type { S2C_Metadata } from "./server_pb";
import { file_server } from "./server_pb";
import type { ObjectInfo } from "./struct_pb";
import { file_struct } from "./struct_pb";
import type { ObjectType } from "./enum_pb";
import { file_enum } from "./enum_pb";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file game.proto.
 */
export const file_game: GenFile = /*@__PURE__*/
  fileDesc("CgpnYW1lLnByb3RvEghQcm90b2NvbCJfChFDMkJfSW5pdGlhbFBhY2tldBIoCgpQbGF5ZXJJbmZvGAEgASgLMhQuUHJvdG9jb2wuT2JqZWN0SW5mbxIOCgZyb29tSWQYAiABKA0SEAoIbmlja25hbWUYAyABKAkiNQoNQjJDX0VudGVyUm9vbRIkCgRtZXRhGAEgASgLMhYuUHJvdG9jb2wuUzJDX01ldGFkYXRhIkcKDUIyQ19HYW1lU3RhcnQSDwoHaXNTdGFydBgBIAEoCBIlCgdwbGF5ZXJzGAIgAygLMhQuUHJvdG9jb2wuT2JqZWN0SW5mbyJuCghDMkJfTW92ZRIoCgpvYmplY3RJbmZvGAEgASgLMhQuUHJvdG9jb2wuT2JqZWN0SW5mbxIoCgpvYmplY3RUeXBlGAIgASgOMhQuUHJvdG9jb2wuT2JqZWN0VHlwZRIOCgZyb29tSWQYAyABKA0iXgoIQjJDX01vdmUSKAoKb2JqZWN0SW5mbxgBIAEoCzIULlByb3RvY29sLk9iamVjdEluZm8SKAoKb2JqZWN0VHlwZRgCIAEoDjIULlByb3RvY29sLk9iamVjdFR5cGViBnByb3RvMw", [file_client, file_server, file_struct, file_enum]);

/**
 * @generated from message Protocol.C2B_InitialPacket
 */
export type C2B_InitialPacket = Message<"Protocol.C2B_InitialPacket"> & {
  /**
   * @generated from field: Protocol.ObjectInfo PlayerInfo = 1;
   */
  PlayerInfo?: ObjectInfo;

  /**
   * @generated from field: uint32 roomId = 2;
   */
  roomId: number;

  /**
   * @generated from field: string nickname = 3;
   */
  nickname: string;
};

/**
 * Describes the message Protocol.C2B_InitialPacket.
 * Use `create(C2B_InitialPacketSchema)` to create a new message.
 */
export const C2B_InitialPacketSchema: GenMessage<C2B_InitialPacket> = /*@__PURE__*/
  messageDesc(file_game, 0);

/**
 * @generated from message Protocol.B2C_EnterRoom
 */
export type B2C_EnterRoom = Message<"Protocol.B2C_EnterRoom"> & {
  /**
   * @generated from field: Protocol.S2C_Metadata meta = 1;
   */
  meta?: S2C_Metadata;
};

/**
 * Describes the message Protocol.B2C_EnterRoom.
 * Use `create(B2C_EnterRoomSchema)` to create a new message.
 */
export const B2C_EnterRoomSchema: GenMessage<B2C_EnterRoom> = /*@__PURE__*/
  messageDesc(file_game, 1);

/**
 * @generated from message Protocol.B2C_GameStart
 */
export type B2C_GameStart = Message<"Protocol.B2C_GameStart"> & {
  /**
   * @generated from field: bool isStart = 1;
   */
  isStart: boolean;

  /**
   * @generated from field: repeated Protocol.ObjectInfo players = 2;
   */
  players: ObjectInfo[];
};

/**
 * Describes the message Protocol.B2C_GameStart.
 * Use `create(B2C_GameStartSchema)` to create a new message.
 */
export const B2C_GameStartSchema: GenMessage<B2C_GameStart> = /*@__PURE__*/
  messageDesc(file_game, 2);

/**
 * @generated from message Protocol.C2B_Move
 */
export type C2B_Move = Message<"Protocol.C2B_Move"> & {
  /**
   * @generated from field: Protocol.ObjectInfo objectInfo = 1;
   */
  objectInfo?: ObjectInfo;

  /**
   * CREATURE, PROJECTILE;
   *
   * @generated from field: Protocol.ObjectType objectType = 2;
   */
  objectType: ObjectType;

  /**
   * @generated from field: uint32 roomId = 3;
   */
  roomId: number;
};

/**
 * Describes the message Protocol.C2B_Move.
 * Use `create(C2B_MoveSchema)` to create a new message.
 */
export const C2B_MoveSchema: GenMessage<C2B_Move> = /*@__PURE__*/
  messageDesc(file_game, 3);

/**
 * @generated from message Protocol.B2C_Move
 */
export type B2C_Move = Message<"Protocol.B2C_Move"> & {
  /**
   * @generated from field: Protocol.ObjectInfo objectInfo = 1;
   */
  objectInfo?: ObjectInfo;

  /**
   * CREATURE, PROJECTILE; 
   *
   * @generated from field: Protocol.ObjectType objectType = 2;
   */
  objectType: ObjectType;
};

/**
 * Describes the message Protocol.B2C_Move.
 * Use `create(B2C_MoveSchema)` to create a new message.
 */
export const B2C_MoveSchema: GenMessage<B2C_Move> = /*@__PURE__*/
  messageDesc(file_game, 4);

