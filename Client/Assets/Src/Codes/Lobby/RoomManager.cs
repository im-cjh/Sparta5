using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using TMPro;
using System;

public class RoomManager : MonoBehaviour
{
    public static RoomManager instance;

    public GameObject playerListPanel;        // 방에 접속한 유저 패널
    public GameObject roomListPanel;        // 방 목록 패널
    public Transform playerListContent;       // Scroll View의 Content에 할당
    public GameObject playerItemPrefab;       // PlayerItem 프리팹
    public Button gameStartButton;            // 게임 시작 버튼

    private List<UserData> users = new List<UserData>(); // 방의 플레이어 목록
    private bool isHost = false;                        // 호스트 여부 확인
    private UInt32 roomId;

    void Awake()
    {
        instance = this;
    }

    void Start()
    {
        //gameStartButton.interactable = isHost;
        gameStartButton.onClick.AddListener(StartGame);

        // 기본적으로 PlayerListPanel을 비활성화
        playerListPanel.SetActive(false);
    }

    // 방 입장 함수
    public void EnterRoom(string roomName)
    {
        Debug.Log($"{roomName} 방에 입장합니다.");
        //방 목록 판넬 disable
        roomListPanel.SetActive(false);

        // PlayerListPanel 활성화
        playerListPanel.SetActive(true);
    }

    // 방의 플레이어 목록 UI 갱신 함수
    public void RefreshPlayerList()
    {
        Debug.Log(users);
        // 기존 플레이어 목록 UI 제거
        foreach (Transform child in playerListContent)
        {
            Destroy(child.gameObject);
        }

        // 새로운 플레이어 목록 UI 추가
        foreach (var user in users)
        {
            GameObject playerItem = Instantiate(playerItemPrefab, playerListContent);

            playerItem.transform.Find("PlayerIdText").GetComponent<TextMeshProUGUI>().text = user.userId;
            playerItem.transform.Find("PlayerNameText").GetComponent<TextMeshProUGUI>().text = user.userName;
            
            //playerItem.GetComponentInChildren<TextMeshProUGUI>().text = user.userName;
        }
    }

    public void OnRecvUserData(List<UserData> pUsers)
    {
        Debug.Log("OnRecvUserData called");

        roomListPanel.SetActive(false );
        playerListPanel.SetActive(true);

        users = pUsers;
        Debug.Log(users);
        RefreshPlayerList();
    }

    // 게임 시작 함수 (호스트만 시작 가능)
    void StartGame()
    {
        //if (!isHost)
        if (false)
        {
            Debug.Log("호스트만 게임을 시작할 수 있습니다.");
            return;
        }

    }

    // 호스트 설정 함수 (방장만 게임 시작 버튼 활성화)
    public void SetHost(bool hostStatus)
    {
        isHost = hostStatus;
        gameStartButton.interactable = isHost;
    }

    private void RequestGameStart()
    {
        Protocol.C2L_GameStart pkt = new Protocol.C2L_GameStart();
        pkt.Meta = new Protocol.C2S_Metadata
        {
            ClientVersion = NewGameManager.instance.version,
            UserId = NewGameManager.instance.deviceId,
        };
        pkt.RoomId = roomId;

        byte[] sendBuffer = PacketUtils.SerializePacket(pkt, ePacketID.C2L_GameStart, NewGameManager.instance.GetNextSequence());
        NetworkManager.instance.SendPacket(sendBuffer);
    }
}
