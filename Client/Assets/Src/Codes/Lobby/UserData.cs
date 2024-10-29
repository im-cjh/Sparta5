using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// 방 정보를 담는 RoomData 클래스
[System.Serializable]
public class UserData
{
    public string userId;               // 유저ID
    public string userName;       // 방 이름

    public UserData(string pUserId, string pUserName)
    {
        userId = pUserId;
        userName = pUserName;
    }
}