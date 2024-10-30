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
    C2L_LeaveRoom = 3,
    C2L_GetRooms = 4,
    C2L_GameStart = 5,
    L2C_Init = 51,
    L2C_EnterRoomMe = 52,
    L2C_EnterRoomOther =53,
    L2C_LeaveRoomMe = 54,
    L2C_LeaveRoomOther = 55,
    L2C_GetRoom = 56,
    L2C_GameStart = 57 
}

[Serializable]
public struct PacketHeader
{
    public UInt16 size;
    public ePacketID id; // 프로토콜ID 
    public UInt32 sequence;
}