using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

public class LobbyManager : MonoBehaviour
{
    public Button createRoomButton; // 방 생성 버튼
    public Transform roomListContent; // Scroll View의 Content에 할당
    public GameObject roomItemPrefab; // RoomItem 프리팹

    // 방 생성 UI 관련 변수
    public GameObject roomCreationPanel;
    public InputField roomNameInput;
    public Button createRoomConfirmButton;
    public Button cancelRoomButton;

    private List<string> rooms = new List<string>(); // 예제 방 데이터

    void Start()
    {
        // 방 생성 버튼 이벤트 연결
        createRoomButton.onClick.AddListener(ShowRoomCreationPanel);

        // 방 생성 확인 및 취소 버튼 이벤트 연결
        createRoomConfirmButton.onClick.AddListener(CreateRoom);
        cancelRoomButton.onClick.AddListener(HideRoomCreationPanel);

        // 방 목록 초기화
        RefreshRoomList();
    }

    // 방 생성 패널을 표시하는 함수
    void ShowRoomCreationPanel()
    {
        roomNameInput.text = ""; // 입력 필드 초기화
        roomCreationPanel.SetActive(true); // 패널 활성화
    }

    // 방 생성 패널을 숨기는 함수
    void HideRoomCreationPanel()
    {
        roomCreationPanel.SetActive(false); // 패널 비활성화
    }

    // 방 생성 함수
    void CreateRoom()
    {
        string roomName = roomNameInput.text.Trim();

        // 방 이름이 비어있는지 확인
        if (string.IsNullOrEmpty(roomName))
        {
            Debug.Log("방 이름을 입력하세요.");
            return;
        }

        // 방 이름 추가 및 방 목록 갱신
        rooms.Add(roomName);
        RefreshRoomList();

        // 방 생성 패널 숨기기
        HideRoomCreationPanel();
    }

    // 방 목록 UI 갱신 함수
    void RefreshRoomList()
    {
        // 기존 방 목록 제거
        foreach (Transform child in roomListContent)
        {
            Destroy(child.gameObject);
        }

        // 새로운 방 목록 UI 추가
        foreach (var roomName in rooms)
        {
            GameObject roomItem = Instantiate(roomItemPrefab, roomListContent);
            roomItem.GetComponentInChildren<Text>().text = roomName;
        }
    }
}
