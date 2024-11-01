using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using TMPro;
using System;
using UnityEngine.Rendering.Universal;

public class RoomManager : MonoBehaviour
{
    public static RoomManager instance;

    public GameObject playerListPanel;        // �濡 ������ ���� �г�
    public GameObject roomListPanel;        // �� ��� �г�
    public Transform playerListContent;       // Scroll View�� Content�� �Ҵ�
    public GameObject playerItemPrefab;       // PlayerItem ������
    public Button gameStartButton;            // ���� ���� ��ư

    private List<UserData> mUsers = new List<UserData>(); // ���� �÷��̾� ���
    private bool isHost = false;                        // ȣ��Ʈ ���� Ȯ��
    private RoomData mRoom;

    void Awake()
    {
        instance = this;
    }

    void Start()
    {
        //gameStartButton.interactable = isHost;
        gameStartButton.onClick.AddListener(RequestGameStart);

        // �⺻������ PlayerListPanel�� ��Ȱ��ȭ
        playerListPanel.SetActive(false);
    }

    // �� ���� �Լ�
    public void EnterRoom(string roomName)
    {
        Debug.Log($"{roomName} �濡 �����մϴ�.");
        //�� ��� �ǳ� disable
        roomListPanel.SetActive(false);

        // PlayerListPanel Ȱ��ȭ
        playerListPanel.SetActive(true);
    }

    // ���� �÷��̾� ��� UI ���� �Լ�
    public void RefreshPlayerList()
    {
        Debug.Log(mUsers);
        // ���� �÷��̾� ��� UI ����
        foreach (Transform child in playerListContent)
        {
            Destroy(child.gameObject);
        }

        // ���ο� �÷��̾� ��� UI �߰�
        foreach (var user in mUsers)
        {
            GameObject playerItem = Instantiate(playerItemPrefab, playerListContent);

            playerItem.transform.Find("PlayerIdText").GetComponent<TextMeshProUGUI>().text = user.userId;
            playerItem.transform.Find("PlayerNameText").GetComponent<TextMeshProUGUI>().text = user.userName;
            
            //playerItem.GetComponentInChildren<TextMeshProUGUI>().text = user.userName;
        }
    }

    public void OnRecvEnterRoomMe(List<UserData> pUsers, RoomData pRoomInfo)
    {
        Debug.Log("OnRecvEnterRoomMe called");

        roomListPanel.SetActive(false );
        playerListPanel.SetActive(true);

        mUsers = pUsers;
        mRoom = pRoomInfo;

        Debug.Log(mUsers);
        RefreshPlayerList();
    }

    public void OnRecvEnterRoomOther(UserData pUser)
    {
        Debug.Log("OnRecvEnterRoomOther called");
        mUsers.Add(pUser);

        Debug.Log(mUsers);
        RefreshPlayerList();
    }



    void OnStartGame()
    {

    }

    // ȣ��Ʈ ���� �Լ� (���常 ���� ���� ��ư Ȱ��ȭ)
    public void SetHost(bool hostStatus)
    {
        isHost = hostStatus;
        gameStartButton.interactable = isHost;
    }

    public void RequestGameStart()
    {
        Protocol.C2L_GameStart pkt = new Protocol.C2L_GameStart();
        pkt.Meta = new Protocol.C2S_Metadata
        {
            ClientVersion = NewGameManager.instance.version,
            UserId = NewGameManager.instance.deviceId,
        };
        pkt.RoomId = mRoom.roomId;
        
        byte[] sendBuffer = PacketUtils.SerializePacket(pkt, ePacketID.C2L_GameStart, NewGameManager.instance.GetNextSequence());
        NetworkManager.instance.SendLobbyPacket(sendBuffer);
    }
}
