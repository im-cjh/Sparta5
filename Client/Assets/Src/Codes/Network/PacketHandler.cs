using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.SceneManagement;


/*---------------------------------------------
    [패킷 핸들러]

    - 목적: ePacketID를 넘겨주면 대응되는 함수를 넘겨주기 위함

        [주의사항]
            - 에러 발생 시, 호출 쪽에서 처리할 것
---------------------------------------------*/
public class PacketHandler
{
    /*---------------------------------------------
            [멤버 변수]

            -Action은 반환 타입이 없는 delegate
    ---------------------------------------------*/
    public static Dictionary<ePacketID, Action<byte[]>> handlerMapping;

/*---------------------------------------------
    [생성자]
---------------------------------------------*/
    static PacketHandler()
    {
        handlerMapping = new Dictionary<ePacketID, Action<byte[]>>();
        Init();
    }

/*---------------------------------------------
    [초기화]
---------------------------------------------*/
    static void Init()
    {
        handlerMapping[ePacketID.L2C_Init] = HandleInitPacket;
        handlerMapping[ePacketID.L2C_GetRoom] = HandleRoomsPacket;
        handlerMapping[ePacketID.L2C_EnterRoomMe] = HandleEnterRoomMe;
        handlerMapping[ePacketID.L2C_EnterRoomOther] = HandleEnterRoomOther;
    }


    /*---------------------------------------------
    []
---------------------------------------------*/
    static void HandleInitPacket(byte[] pBuffer)
    {
        //패킷 역직렬화
        Protocol.L2C_Init pkt = Protocol.L2C_Init.Parser.ParseFrom(pBuffer);

        //게임 시작
        InitialData data = new InitialData();
        data.userId = pkt.UserId;

        //임시
        SceneChanger.ChangeLobbyScene();
        //GameManager.instance.GameStart();
    }


    /*---------------------------------------------
    [방 목록 응답]
---------------------------------------------*/
    static void HandleRoomsPacket(byte[] pBuffer)
    {
        //패킷 역직렬화
        Protocol.L2C_RoomList pkt = Protocol.L2C_RoomList.Parser.ParseFrom(pBuffer);

        List<RoomData> rooms = new List<RoomData>();
        
        
        foreach(var room in pkt.Rooms)
        {
            rooms.Add(new RoomData(room.RoomId, room.RoomName, room.CurrentCount, room.MaxCount));
        }

        LobbyManager.instance.OnRecvRooms(rooms);
    }

    /*---------------------------------------------
    [방 입장 응답]
    -자신이 방에 입장했을 때
    -기존 플레이어 목록 받기
---------------------------------------------*/
    static void HandleEnterRoomMe(byte[] pBuffer)
    {
        Debug.Log("HandleEnterRoomMe Called");

        Protocol.L2C_EnterRoomMe pkt = Protocol.L2C_EnterRoomMe.Parser.ParseFrom(pBuffer);
        if(pkt.IsEntered == false)
        {
            throw new Exception("방 입장 실패");
        }
        
        List<UserData> users = new List<UserData>();
        foreach(var user in pkt.Users)
        {
            users.Add(new UserData(user.UserId, user.Nickname));
        }

        LobbyManager.instance.OnRecvEnterRoomMe(users);
    }

    /*---------------------------------------------
    [방 입장 응답]
    - 다른 플레이어가 방에 입장했을 때
---------------------------------------------*/
    static void HandleEnterRoomOther(byte[] pBuffer)
    {
        Debug.Log("HandleEnterRoomOther Called");
    }
}
