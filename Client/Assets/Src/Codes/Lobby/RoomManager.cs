using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using TMPro;

public class RoomManager : MonoBehaviour
{
    public static RoomManager instance;

    public GameObject playerListPanel;        // �濡 ������ ���� �г�
    public GameObject roomListPanel;        // �� ��� �г�
    public Transform playerListContent;       // Scroll View�� Content�� �Ҵ�
    public GameObject playerItemPrefab;       // PlayerItem ������
    public Button gameStartButton;            // ���� ���� ��ư

    private List<UserData> users = new List<UserData>(); // ���� �÷��̾� ���
    private bool isHost = false;                        // ȣ��Ʈ ���� Ȯ��

    void Awake()
    {
        instance = this;
    }

    void Start()
    {
        //gameStartButton.interactable = isHost;
        gameStartButton.onClick.AddListener(StartGame);

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
        Debug.Log(users);
        // ���� �÷��̾� ��� UI ����
        foreach (Transform child in playerListContent)
        {
            Destroy(child.gameObject);
        }

        // ���ο� �÷��̾� ��� UI �߰�
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

    // ���� ���� �Լ� (ȣ��Ʈ�� ���� ����)
    void StartGame()
    {
        //if (!isHost)
        if (false)
        {
            Debug.Log("ȣ��Ʈ�� ������ ������ �� �ֽ��ϴ�.");
            return;
        }

        
    }

    // ȣ��Ʈ ���� �Լ� (���常 ���� ���� ��ư Ȱ��ȭ)
    public void SetHost(bool hostStatus)
    {
        isHost = hostStatus;
        gameStartButton.interactable = isHost;
    }
}
