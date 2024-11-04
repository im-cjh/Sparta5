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
        handlerMapping[ePacketID.L2C_GameStart] = HandleLobbyGameStart;
        handlerMapping[ePacketID.B2C_GameStart] = HandleBattleGameStart;
        //handlerMapping[ePacketID.B2C_Enter] = HandleEnterGame;
        handlerMapping[ePacketID.B2C_Move] = HandleMove;
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
            rooms.Add(new RoomData(room.RoomId, room.RoomName, room.CurrentPlayers, room.MaxPlayers));
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
        if(pkt.Meta.ResponseCode != 0)
        {
            Debug.Log("방 입장 실패" + pkt.Meta.ResponseCode);
            throw new Exception("방 입장 실패");
        }
        List<UserData> users = new List<UserData>();
        foreach(var user in pkt.Users)
        {
            users.Add(new UserData(user.UserId, user.Nickname));
        }
        Debug.Log(pkt.RoomInfo);
        RoomData roomData = new RoomData(pkt.RoomInfo.RoomId, pkt.RoomInfo.RoomName, pkt.RoomInfo.CurrentPlayers, pkt.RoomInfo.MaxPlayers);

        NewGameManager.instance.roomId = pkt.RoomInfo.RoomId;
        LobbyManager.instance.OnRecvEnterRoomMe(users, roomData);
    }

    /*---------------------------------------------
    [방 입장 응답]
    - 다른 플레이어가 방에 입장했을 때
---------------------------------------------*/
    static void HandleEnterRoomOther(byte[] pBuffer)
    {
        Debug.Log("HandleEnterRoomOther Called");

        Protocol.L2C_EnterRoomOther pkt = Protocol.L2C_EnterRoomOther.Parser.ParseFrom(pBuffer);
        if (pkt.Meta.ResponseCode != 0)
        {
            Debug.Log("실패" + pkt.Meta.ResponseCode);
            throw new Exception("실패");
        }

        UserData user = new UserData(pkt.NewUser.UserId, pkt.NewUser.Nickname);
        
        Debug.Log(pkt.NewUser);
        
        RoomManager.instance.OnRecvEnterRoomOther(user);
    }

    /*---------------------------------------------
    [게임 시작 1/2]
    - 배틀 서버의 주소와 포트번호, 방 ID를 받아옴
    - 배틀 서버에 연결
---------------------------------------------*/
    static void HandleLobbyGameStart(byte[] pBuffer)
    {
        Protocol.L2C_GameStart pkt = Protocol.L2C_GameStart.Parser.ParseFrom(pBuffer);
        if (pkt.Meta.ResponseCode != 0) {
            Debug.Log("실패" + pkt.Meta.ResponseCode);
            throw new Exception("실패");
        }

        Debug.Log("게임시작 1");
        
        NetworkManager.instance.ConnectToBattleServer(pkt.Host, pkt.Port, pkt.RoomId);
    }

    /*---------------------------------------------
    [게임 시작 2/2]
    - 모든 플레이어가 접속하여 게임 시작
---------------------------------------------*/
    static void HandleBattleGameStart(byte[] pBuffer)
    {
        Protocol.B2C_GameStart pkt = Protocol.B2C_GameStart.Parser.ParseFrom(pBuffer);
        NewGameManager.instance.tmp_gameStartPacket = pkt;

        SceneChanger.ChangeGameScene();
    }

    /*---------------------------------------------
    [게임 입장]
    - 다른 플레이어의 uuid와 prefab을 pool manager에 저장
    - 이동 동기화를 포함한 동작에 사용됨
---------------------------------------------*/


    /*---------------------------------------------
    [이동 동기화]
---------------------------------------------*/
    static void HandleMove(byte[] pBuffer)
    {
        Debug.Log("HandleMove");
        try
        {
            Protocol.B2C_Move response = Protocol.B2C_Move.Parser.ParseFrom(pBuffer);

            Spawner.instance.Spawn(response);
        }
        catch (Exception e)
        {
            Debug.LogError($"Error HandleLocationPacket: {e.Message}");
        }
    }
}
