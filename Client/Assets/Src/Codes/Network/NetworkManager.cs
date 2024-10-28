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
    public InputField portInputField;
    public InputField deviceIdInputField;
    public GameObject uiNotice;
    private TcpClient tcpClient;
    private NetworkStream stream;
    
    WaitForSecondsRealtime wait;

    private byte[] receiveBuffer = new byte[4096];
    private List<byte> incompleteData = new List<byte>();

    void Awake() {        
        instance = this;
        wait = new WaitForSecondsRealtime(5);
    }
    public void OnStartButtonClicked() {
        //string ip = ipInputField.text;
        string ip = "127.0.0.1";
        string port = "3000";
        //string port = portInputField.text;

        if (IsValidPort(port)) {
            int portNumber = int.Parse(port);

            if (deviceIdInputField.text != "") {
                GameManager.instance.deviceId = deviceIdInputField.text;
            } else {
                if (GameManager.instance.deviceId == "") {
                    GameManager.instance.deviceId = GenerateUniqueID();
                }
            }
  
            if (ConnectToServer(ip, portNumber)) {
                StartGame();
            } else {
                AudioManager.instance.PlaySfx(AudioManager.Sfx.LevelUp);
                StartCoroutine(NoticeRoutine(1));
            }
            
        } else {
            AudioManager.instance.PlaySfx(AudioManager.Sfx.LevelUp);
            StartCoroutine(NoticeRoutine(0));
        }
    }

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

     bool ConnectToServer(string ip, int port) {
        try {
            tcpClient = new TcpClient(ip, port);
            stream = tcpClient.GetStream();
            Debug.Log($"Connected to {ip}:{port}");

            return true;
        } catch (SocketException e) {
            Debug.LogError($"SocketException: {e}");
            return false;
        }
    }

    string GenerateUniqueID() {
        return System.Guid.NewGuid().ToString();
    }

    void StartGame()
    {
        // 게임 시작 코드 작성
        Debug.Log("Game Started");
        StartReceiving(); // Start receiving data
        SendInitialPacket();
    }

    IEnumerator NoticeRoutine(int index) {
        
        uiNotice.SetActive(true);
        uiNotice.transform.GetChild(index).gameObject.SetActive(true);

        yield return wait;

        uiNotice.SetActive(false);
        uiNotice.transform.GetChild(index).gameObject.SetActive(false);
    }

    //패킷 전송
    async void SendPacket(byte[] sendBuffer)
    {

        await Task.Delay(GameManager.instance.latency);
        
        // 패킷 전송
        stream.Write(sendBuffer, 0, sendBuffer.Length);
    }

    void SendInitialPacket() {
        Protocol.C2L_InitialPacket pkt = new Protocol.C2L_InitialPacket();
        pkt.Meta = new Protocol.C2S_Metadata 
        {
            ClientVersion = GameManager.instance.version,
            UserId = GameManager.instance.deviceId,
        };
        pkt.Latency = GameManager.instance.latency;
        pkt.PlayerId = GameManager.instance.playerId;

        byte[] sendBuffer = PacketUtils.SerializePacket(pkt, ePacketID.C2L_Init, GameManager.instance.GetNextSequence());
        Debug.Log(sendBuffer.Length);
        // handlerId는 0으로 가정
        SendPacket(sendBuffer);
    }

    public void SendLocationUpdatePacket(float x, float y) 
    {
        //LocationUpdatePayload locationUpdatePayload = new LocationUpdatePayload
        //{
        //    x = x,
        //    y = y,
        //};

        
//        SendPacket(sendBuffer);
    }


    void StartReceiving() {
        _ = ReceivePacketsAsync();
    }

    async System.Threading.Tasks.Task ReceivePacketsAsync() {
        while (tcpClient.Connected) {
            try {
                int bytesRead = await stream.ReadAsync(receiveBuffer, 0, receiveBuffer.Length);
                if (bytesRead > 0) {
                    ProcessReceivedData(receiveBuffer, bytesRead);
                }
            } catch (Exception e) {
                Debug.LogError($"Receive error: {e.Message}");
                break;
            }
        }
    }

    void ProcessReceivedData(byte[] data, int length) {
         incompleteData.AddRange(data.AsSpan(0, length).ToArray());

        Debug.Log("ProcessReceivedData"+ incompleteData.Count);
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
                Debug.Log("데이터가 충분하지 않으면 반환" + incompleteData.Count+ " : " + header.size);
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
        Action<byte[], ushort> handler;
        try
        {
            handler = PacketHandler.handlerMapping[pId];
        }
        catch (Exception e)
        {
            Debug.Log("패킷id가 잘못되었습니다: "+pId);
            return; //throw e;
        }
        //핸들러 호출
        try
        {
            handler(pBuffer, pLen);
        }
        catch (Exception e)
        {
            Debug.LogError(e);
            return; //throw e;
        }
    }

    void HandleNormalPacket(byte[] packetData) {
        // 패킷 데이터 처리
        var response = Packets.Deserialize<Response>(packetData);
        // Debug.Log($"HandlerId: {response.handlerId}, responseCode: {response.responseCode}, timestamp: {response.timestamp}");
        
        if (response.responseCode != 0 && !uiNotice.activeSelf) {
            AudioManager.instance.PlaySfx(AudioManager.Sfx.LevelUp);
            StartCoroutine(NoticeRoutine(2));
            return;
        }

        if (response.data != null && response.data.Length > 0) {
            ProcessResponseData(response);
        }
    }

    void ProcessResponseData(Response response) {
        //try {
        //    string jsonString = Encoding.UTF8.GetString(response.data);

        //    switch (response.handlerId) {
        //        case (uint) Packets.HandlerIds.Init: {
        //            InitialData data = new InitialData();
        //            data.userId = Packets.ExtractValue(jsonString, "userId");
        //            data.x = float.Parse(Packets.ExtractValue(jsonString, "x"));
        //            data.y = float.Parse(Packets.ExtractValue(jsonString, "y"));
        //            Debug.Log($"userId: {data.userId}, x: {data.x}, y: {data.y}");

        //            GameManager.instance.GameStart(data);
        //            break;
        //        }
        //    }

        //} catch (Exception e) {
        //    Debug.LogError($"Error processing response data: {e.Message}");
        //}
    }

    void HandleLocationPacket(byte[] data) {
        try {
            LocationUpdate response;

            if (data.Length > 0) {
                // 패킷 데이터 처리
                response = Packets.Deserialize<LocationUpdate>(data);
            } else {
                // data가 비어있을 경우 빈 배열을 전달
                response = new LocationUpdate { users = new List<LocationUpdate.UserLocation>() };
            }

            Spawner.instance.Spawn(response);
        } catch (Exception e) {
            Debug.LogError($"Error HandleLocationPacket: {e.Message}");
        }
    }
}
