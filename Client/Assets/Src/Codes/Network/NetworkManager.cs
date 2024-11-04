using System;
using System.Buffers;
using System.Collections;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.UI;

public class NetworkManager : MonoBehaviour
{
    public static NetworkManager instance;

    public InputField ipInputField;
    public InputField nicknameInputField;
    public InputField deviceIdInputField;
    public GameObject uiNotice;

    private TcpClient mLobbyTcpClient;
    private NetworkStream mLobbyStream;

    // 배틀 서버 관련 멤버 변수 추가
    private TcpClient mBattleTcpClient;
    private NetworkStream mBattleStream;

    WaitForSecondsRealtime wait;

    private byte[] mRecvBuffer = new byte[4096];
    private List<byte> incompleteData = new List<byte>();

    void Awake()
    {
        instance = this;
        DontDestroyOnLoad(this);
        wait = new WaitForSecondsRealtime(5);
    }

    /*---------------------------------------------
    [시작 버튼 클릭 처리 이벤트]

    1. port 번호 유호성 검사
    2. deviceID 확인
        2-1. 비어있으면 무작위 값
    3. 로비 서버 Connect
    4. GameStart()호출
---------------------------------------------*/
    public void OnStartButtonClicked()
    {
        //string ip = ipInputField.text;
        string ip = "127.0.0.1";
        string port = "3000";
        string nickname = nicknameInputField.text;
        if (nickname == "") nickname = "node.js";

        int portNumber = int.Parse(port);

        if (deviceIdInputField.text != "")
        {
            NewGameManager.instance.deviceId = deviceIdInputField.text;
            //GameManager.instance.deviceId = deviceIdInputField.text;
        }
        else
        {
            if (NewGameManager.instance.deviceId == "")
            {
                //if (GameManager.instance.deviceId == "") {
                NewGameManager.instance.deviceId = GenerateUniqueID();
                //GameManager.instance.deviceId = GenerateUniqueID();
            }
        }

        NewGameManager.instance.nickname = nickname;
        if (ConnectToLobbyServer(ip, portNumber))
        {
            StartGame();
        }
        else
        {
            AudioManager.instance.PlaySfx(AudioManager.Sfx.LevelUp);
            StartCoroutine(NoticeRoutine(1));
        }

    }


    bool ConnectToLobbyServer(string ip, int port)
    {
        try
        {
            mLobbyTcpClient = new TcpClient(ip, port);
            mLobbyStream = mLobbyTcpClient.GetStream();
            Debug.Log($"Connected to {ip}:{port}");

            return true;
        }
        catch (SocketException e)
        {
            Debug.LogError($"SocketException: {e}");
            return false;
        }
    }

    public bool ConnectToBattleServer(string ip, int port, UInt32 pRoomId)
    {
        Debug.Log("ConnectToBattleServer");
        try
        {
            mBattleTcpClient = new TcpClient(ip, port);
            mBattleStream = mBattleTcpClient.GetStream();
            Debug.Log($"Connected to {ip}:{port}");

            StartBattleReceiving();

            Protocol.C2B_InitialPacket pkt = new Protocol.C2B_InitialPacket();
            pkt.PlayerInfo = new Protocol.ObjectInfo
            {
                Posinfo = new Protocol.PosInfo { ObjectId = NewGameManager.instance.deviceId, X = 0, Y = 0 },
                PrefabIndex = NewGameManager.instance.playerId,
            };
            pkt.RoomId = pRoomId;
            pkt.Nickname = NewGameManager.instance.nickname;

            byte[] sendBuffer = PacketUtils.SerializePacket(pkt, ePacketID.C2B_Init, NewGameManager.instance.GetNextSequence());
            SendBattlePacket(sendBuffer);
            return true;
        }
        catch (SocketException e)
        {
            Debug.LogError($"SocketException: {e}");
            return false;
        }
    }
    string GenerateUniqueID()
    {
        return System.Guid.NewGuid().ToString();
    }

    void StartGame()
    {
        // 게임 시작 코드 작성
        Debug.Log("Game Started");
        StartLobbyReceiving(); // Start receiving data
        SendInitialPacket();
    }

    IEnumerator NoticeRoutine(int index)
    {

        uiNotice.SetActive(true);
        uiNotice.transform.GetChild(index).gameObject.SetActive(true);

        yield return wait;

        uiNotice.SetActive(false);
        uiNotice.transform.GetChild(index).gameObject.SetActive(false);
    }

    /*---------------------------------------------
[Send]
---------------------------------------------*/
    public async void SendLobbyPacket(byte[] sendBuffer)
    {

        await Task.Delay(NewGameManager.instance.latency);
        //await Task.Delay(GameManager.instance.latency);

        // 패킷 전송
        mLobbyStream.Write(sendBuffer, 0, sendBuffer.Length);
    }
    public async void SendBattlePacket(byte[] sendBuffer)
    {

        await Task.Delay(NewGameManager.instance.latency);
        //await Task.Delay(GameManager.instance.latency);

        // 패킷 전송
        mBattleStream.Write(sendBuffer, 0, sendBuffer.Length);
    }

    void SendInitialPacket()
    {
        Protocol.C2L_InitialPacket pkt = new Protocol.C2L_InitialPacket();
        pkt.Meta = new Protocol.C2S_Metadata
        {
            ClientVersion = NewGameManager.instance.version,
            //ClientVersion = GameManager.instance.version,
            UserId = NewGameManager.instance.deviceId,
            //UserId = GameManager.instance.deviceId,
        };
        pkt.Latency = NewGameManager.instance.latency;
        //pkt.Latency = GameManager.instance.latency;
        pkt.PlayerId = NewGameManager.instance.playerId;
        pkt.Nickname = NewGameManager.instance.nickname;

        byte[] sendBuffer = PacketUtils.SerializePacket(pkt, ePacketID.C2L_Init, NewGameManager.instance.GetNextSequence());
        //byte[] sendBuffer = PacketUtils.SerializePacket(pkt, ePacketID.C2L_Init, GameManager.instance.GetNextSequence());
        Debug.Log(sendBuffer.Length);
        // handlerId는 0으로 가정
        SendLobbyPacket(sendBuffer);
    }

    void StartLobbyReceiving()
    {
        _ = RecvLobbyPacketsAsync();
    }

    void StartBattleReceiving()
    {
        _ = RecvBattlePacketsAsync();
    }

    /*---------------------------------------------
[RegisterRecv]
    -로비서버
---------------------------------------------*/
    async System.Threading.Tasks.Task RecvLobbyPacketsAsync()
    {
        while (mLobbyTcpClient.Connected)
        {
            try
            {
                int bytesRead = await mLobbyStream.ReadAsync(mRecvBuffer, 0, mRecvBuffer.Length);
                if (bytesRead > 0)
                {
                    OnData(mRecvBuffer, bytesRead);
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"Receive error: {e.Message}");
                break;
            }
        }
    }

    /*---------------------------------------------
[RegisterRecv]
    -배틀서버
---------------------------------------------*/
    async System.Threading.Tasks.Task RecvBattlePacketsAsync()
    {
        while (mBattleTcpClient.Connected)
        {
            try
            {
                int bytesRead = await mBattleStream.ReadAsync(mRecvBuffer, 0, mRecvBuffer.Length);
                if (bytesRead > 0)
                {
                    OnData(mRecvBuffer, bytesRead);
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"Receive error: {e.Message}");
                break;
            }
        }
    }

    /*---------------------------------------------
    [OnData] 
    1. 온전한 패킷이 왔는지 확인
    2. 패킷 추출(byte[])
    3. PacketHeader를 읽어서 ePacket에 대응되는 핸들러 함수 호출
---------------------------------------------*/
    void OnData(byte[] data, int length)
    {
        incompleteData.AddRange(data.AsSpan(0, length).ToArray());

        //Debug.Log("ProcessReceivedData" + incompleteData.Count);
        //헤더는 읽을 수 있음
        while (incompleteData.Count >= Marshal.SizeOf(typeof(PacketHeader)))
        {
            // 패킷 길이와 타입 읽기
            //서버에서 subaray한거랑 비슷한듯 ㅎㅎ
            byte[] lengthBytes = incompleteData.GetRange(0, Marshal.SizeOf(typeof(PacketHeader))).ToArray();
            PacketHeader header = MemoryMarshal.Read<PacketHeader>(lengthBytes);

            // 헤더에 기록된 패킷 크기를 파싱할 수 있어야 한다
            if (incompleteData.Count < header.size)
            {
                //Debug.Log("데이터가 충분하지 않으면 반환" + incompleteData.Count + " : " + header.size);
                return;
            }

            // 패킷 데이터 추출
            byte[] packetData = incompleteData.GetRange(Marshal.SizeOf(typeof(PacketHeader)), header.size - Marshal.SizeOf(typeof(PacketHeader))).ToArray();
            incompleteData.RemoveRange(0, header.size);

            // Debug.Log($"Received packet: Length = {packetLength}, Type = {packetType}");
            HandlePacket(packetData, header.size, header.id);
        }
    }

    /*---------------------------------------------
  [handlePacket]
  - 목적: 수신한 패킷의 Id에 맞는 함수 호출

  1. 패킷 ID에 해당하는 핸들러 확인
    1-1. 핸들러가 존재하지 않을 경우 오류 출력
  2. 핸들러 호출
---------------------------------------------*/
    private void HandlePacket(byte[] pBuffer, ushort pLen, ePacketID pId)
    {
        //핸들러가 존재하지 않을 경우 오류 출력
        Action<byte[]> handler;
        try
        {
            handler = PacketHandler.handlerMapping[pId];
        }
        catch (Exception e)
        {
            Debug.Log("패킷id가 잘못되었습니다: " + pId);
            return; //throw e;
        }
        //핸들러 호출
        try
        {
            handler(pBuffer);
        }
        catch (Exception e)
        {
            Debug.LogError(e);
            return; //throw e;
        }
    }

    void HandleNormalPacket(byte[] packetData)
    {
        // 패킷 데이터 처리
        var response = Packets.Deserialize<Response>(packetData);
        // Debug.Log($"HandlerId: {response.handlerId}, responseCode: {response.responseCode}, timestamp: {response.timestamp}");

        if (response.responseCode != 0 && !uiNotice.activeSelf)
        {
            AudioManager.instance.PlaySfx(AudioManager.Sfx.LevelUp);
            StartCoroutine(NoticeRoutine(2));
            return;
        }

        if (response.data != null && response.data.Length > 0)
        {
            //ProcessResponseData(response);
        }
    }


    /*---------------------------------------------
    [유효성 검사]
---------------------------------------------*/
    bool IsValidIP(string ip)
    {
        // 간단한 IP 유효성 검사
        return System.Net.IPAddress.TryParse(ip, out _);
    }

    bool IsValidPort(string port)
    {
        // 간단한 포트 유효성 검사 (0 - 65535)
        if (int.TryParse(port, out int portNumber))
        {
            return portNumber > 0 && portNumber <= 65535;
        }
        return false;
    }
}
