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
            "CgplbnVtLnByb3RvEghQcm90b2NvbCo1CgpPYmplY3RUeXBlEgoKBlBMQVlF",
            "UhAAEgsKB01PTlNURVIQARIOCgpQUk9KRUNUSUxFEAJiBnByb3RvMw=="));
      descriptor = pbr::FileDescriptor.FromGeneratedCode(descriptorData,
          new pbr::FileDescriptor[] { },
          new pbr::GeneratedClrTypeInfo(new[] {typeof(global::Protocol.ObjectType), }, null, null));
    }
    #endregion

  }
  #region Enums
  public enum ObjectType {
    [pbr::OriginalName("PLAYER")] Player = 0,
    [pbr::OriginalName("MONSTER")] Monster = 1,
    [pbr::OriginalName("PROJECTILE")] Projectile = 2,
  }

  #endregion

}

#endregion Designer generated code
