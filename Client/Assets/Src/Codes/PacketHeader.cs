using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public enum ePacketID : UInt16
{
    S2C_Error = 0,
    C2L_Init = 1,
    C2L_EnterRoom = 2,
    L2C_Init = 51,
    L2C_EnterRoom = 52,
}

[Serializable]
public struct PacketHeader
{
    public UInt16 size;
    public ePacketID id; // 프로토콜ID 
    public UInt32 sequence;
}