using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using UnityEngine.SceneManagement;

public class RoomManager : MonoBehaviour
{
    public Transform playerListContent; // Scroll View의 Content에 할당
    public GameObject playerItemPrefab; // PlayerItem 프리팹

    public Button gameStartButton; // 게임 시작 버튼

    private List<string> players = new List<string>(); // 방에 있는 플레이어 목록
    private bool isHost = false; // 호스트 여부 확인

    void Start()
    {
        // 방장이면 게임 시작 버튼을 활성화
        gameStartButton.interactable = isHost;
        gameStartButton.onClick.AddListener(StartGame);

        // 방에 들어오면서 플레이어 목록을 갱신
        RefreshPlayerList();
    }

    // 방에 있는 플레이어 목록 UI 갱신 함수
    public void RefreshPlayerList()
    {
        // 기존 플레이어 목록 UI 제거
        foreach (Transform child in playerListContent)
        {
            Destroy(child.gameObject);
        }

        // 새로운 플레이어 목록 UI 추가
        foreach (var playerName in players)
        {
            GameObject playerItem = Instantiate(playerItemPrefab, playerListContent);
            playerItem.GetComponentInChildren<Text>().text = playerName;
        }
    }

    // 게임 시작 함수 (호스트만 시작 가능)
    void StartGame()
    {
        if (!isHost)
        {
            Debug.Log("호스트만 게임을 시작할 수 있습니다.");
            return;
        }

        // 게임 씬으로 이동 (예: GameScene)
        SceneManager.LoadScene("GameScene");
    }

    // 플레이어 추가 함수
    public void AddPlayer(string playerName)
    {
        players.Add(playerName);
        RefreshPlayerList();
    }

    // 플레이어 제거 함수
    public void RemovePlayer(string playerName)
    {
        players.Remove(playerName);
        RefreshPlayerList();
    }

    // 호스트 설정 함수 (방장만 게임 시작 버튼 활성화)
    public void SetHost(bool hostStatus)
    {
        isHost = hostStatus;
        gameStartButton.interactable = isHost;
    }
}
