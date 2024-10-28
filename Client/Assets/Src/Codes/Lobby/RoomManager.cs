using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using UnityEngine.SceneManagement;

public class RoomManager : MonoBehaviour
{
    public Transform playerListContent; // Scroll View�� Content�� �Ҵ�
    public GameObject playerItemPrefab; // PlayerItem ������

    public Button gameStartButton; // ���� ���� ��ư

    private List<string> players = new List<string>(); // �濡 �ִ� �÷��̾� ���
    private bool isHost = false; // ȣ��Ʈ ���� Ȯ��

    void Start()
    {
        // �����̸� ���� ���� ��ư�� Ȱ��ȭ
        gameStartButton.interactable = isHost;
        gameStartButton.onClick.AddListener(StartGame);

        // �濡 �����鼭 �÷��̾� ����� ����
        RefreshPlayerList();
    }

    // �濡 �ִ� �÷��̾� ��� UI ���� �Լ�
    public void RefreshPlayerList()
    {
        // ���� �÷��̾� ��� UI ����
        foreach (Transform child in playerListContent)
        {
            Destroy(child.gameObject);
        }

        // ���ο� �÷��̾� ��� UI �߰�
        foreach (var playerName in players)
        {
            GameObject playerItem = Instantiate(playerItemPrefab, playerListContent);
            playerItem.GetComponentInChildren<Text>().text = playerName;
        }
    }

    // ���� ���� �Լ� (ȣ��Ʈ�� ���� ����)
    void StartGame()
    {
        if (!isHost)
        {
            Debug.Log("ȣ��Ʈ�� ������ ������ �� �ֽ��ϴ�.");
            return;
        }

        // ���� ������ �̵� (��: GameScene)
        SceneManager.LoadScene("GameScene");
    }

    // �÷��̾� �߰� �Լ�
    public void AddPlayer(string playerName)
    {
        players.Add(playerName);
        RefreshPlayerList();
    }

    // �÷��̾� ���� �Լ�
    public void RemovePlayer(string playerName)
    {
        players.Remove(playerName);
        RefreshPlayerList();
    }

    // ȣ��Ʈ ���� �Լ� (���常 ���� ���� ��ư Ȱ��ȭ)
    public void SetHost(bool hostStatus)
    {
        isHost = hostStatus;
        gameStartButton.interactable = isHost;
    }
}
