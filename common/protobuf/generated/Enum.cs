// <auto-generated>
//     Generated by the protocol buffer compiler.  DO NOT EDIT!
//     source: enum.proto
// </auto-generated>
#pragma warning disable 1591, 0612, 3021, 8981
#region Designer generated code

using pb = global::Google.Protobuf;
using pbc = global::Google.Protobuf.Collections;
using pbr = global::Google.Protobuf.Reflection;
using scg = global::System.Collections.Generic;
namespace Protocol {

  /// <summary>Holder for reflection information generated from enum.proto</summary>
  public static partial class EnumReflection {

    #region Descriptor
    /// <summary>File descriptor for enum.proto</summary>
    public static pbr::FileDescriptor Descriptor {
      get { return descriptor; }
    }
    private static pbr::FileDescriptor descriptor;

    static EnumReflection() {
      byte[] descriptorData = global::System.Convert.FromBase64String(
          string.Concat(
            "CgplbnVtLnByb3RvEghQcm90b2NvbCpXCgpPYmplY3RUeXBlEhgKFE9CSkVD",
            "VF9UWVBFX0NSRUFUVVJFEAASGgoWT0JKRUNUX1RZUEVfUFJPSkVDVElMRRAB",
            "EhMKD09CSkVDVF9UWVBFX0VOVhACYgZwcm90bzM="));
      descriptor = pbr::FileDescriptor.FromGeneratedCode(descriptorData,
          new pbr::FileDescriptor[] { },
          new pbr::GeneratedClrTypeInfo(new[] {typeof(global::Protocol.ObjectType), }, null, null));
    }
    #endregion

  }
  #region Enums
  public enum ObjectType {
    [pbr::OriginalName("OBJECT_TYPE_CREATURE")] Creature = 0,
    [pbr::OriginalName("OBJECT_TYPE_PROJECTILE")] Projectile = 1,
    [pbr::OriginalName("OBJECT_TYPE_ENV")] Env = 2,
  }

  #endregion

}

#endregion Designer generated code