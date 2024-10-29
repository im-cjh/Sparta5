using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// 방 정보를 담는 RoomData 클래스
[System.Serializable]
public class RoomData
{
    public UInt32 roomId;
    public string roomName;       // 방 이름
    public int currentCount;      // 현재 인원 수
    public int maxCount;          // 최대 인원 수

    public RoomData(UInt32 pRoomId, string pRoomName, int pCurrentCount, int pMaxCount)
    {
        roomId = pRoomId;
        roomName = pRoomName;
        currentCount = pCurrentCount;
        maxCount = pMaxCount;
    }
}