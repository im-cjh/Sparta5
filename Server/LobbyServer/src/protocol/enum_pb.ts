// @generated by protoc-gen-es v2.2.0 with parameter "target=ts"
// @generated from file enum.proto (package Protocol, syntax proto3)
/* eslint-disable */

import type { GenEnum, GenFile } from "@bufbuild/protobuf/codegenv1";
import { enumDesc, fileDesc } from "@bufbuild/protobuf/codegenv1";

/**
 * Describes the file enum.proto.
 */
export const file_enum: GenFile = /*@__PURE__*/
  fileDesc("CgplbnVtLnByb3RvEghQcm90b2NvbCpXCgpPYmplY3RUeXBlEhgKFE9CSkVDVF9UWVBFX0NSRUFUVVJFEAASGgoWT0JKRUNUX1RZUEVfUFJPSkVDVElMRRABEhMKD09CSkVDVF9UWVBFX0VOVhACYgZwcm90bzM");

/**
 * @generated from enum Protocol.ObjectType
 */
export enum ObjectType {
  /**
   * @generated from enum value: OBJECT_TYPE_CREATURE = 0;
   */
  CREATURE = 0,

  /**
   * @generated from enum value: OBJECT_TYPE_PROJECTILE = 1;
   */
  PROJECTILE = 1,

  /**
   * @generated from enum value: OBJECT_TYPE_ENV = 2;
   */
  ENV = 2,
}

/**
 * Describes the enum Protocol.ObjectType.
 */
export const ObjectTypeSchema: GenEnum<ObjectType> = /*@__PURE__*/
  enumDesc(file_enum, 0);
