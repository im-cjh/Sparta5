using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

public class LobbyManager : MonoBehaviour
{
    public Button createRoomButton; // �� ���� ��ư
    public Transform roomListContent; // Scroll View�� Content�� �Ҵ�
    public GameObject roomItemPrefab; // RoomItem ������

    // �� ���� UI ���� ����
    public GameObject roomCreationPanel;
    public InputField roomNameInput;
    public Button createRoomConfirmButton;
    public Button cancelRoomButton;

    private List<string> rooms = new List<string>(); // ���� �� ������

    void Start()
    {
        // �� ���� ��ư �̺�Ʈ ����
        createRoomButton.onClick.AddListener(ShowRoomCreationPanel);

        // �� ���� Ȯ�� �� ��� ��ư �̺�Ʈ ����
        createRoomConfirmButton.onClick.AddListener(CreateRoom);
        cancelRoomButton.onClick.AddListener(HideRoomCreationPanel);

        // �� ��� �ʱ�ȭ
        RefreshRoomList();
    }

    // �� ���� �г��� ǥ���ϴ� �Լ�
    void ShowRoomCreationPanel()
    {
        roomNameInput.text = ""; // �Է� �ʵ� �ʱ�ȭ
        roomCreationPanel.SetActive(true); // �г� Ȱ��ȭ
    }

    // �� ���� �г��� ����� �Լ�
    void HideRoomCreationPanel()
    {
        roomCreationPanel.SetActive(false); // �г� ��Ȱ��ȭ
    }

    // �� ���� �Լ�
    void CreateRoom()
    {
        string roomName = roomNameInput.text.Trim();

        // �� �̸��� ����ִ��� Ȯ��
        if (string.IsNullOrEmpty(roomName))
        {
            Debug.Log("�� �̸��� �Է��ϼ���.");
            return;
        }

        // �� �̸� �߰� �� �� ��� ����
        rooms.Add(roomName);
        RefreshRoomList();

        // �� ���� �г� �����
        HideRoomCreationPanel();
    }

    // �� ��� UI ���� �Լ�
    void RefreshRoomList()
    {
        // ���� �� ��� ����
        foreach (Transform child in roomListContent)
        {
            Destroy(child.gameObject);
        }

        // ���ο� �� ��� UI �߰�
        foreach (var roomName in rooms)
        {
            GameObject roomItem = Instantiate(roomItemPrefab, roomListContent);
            roomItem.GetComponentInChildren<Text>().text = roomName;
        }
    }
}
