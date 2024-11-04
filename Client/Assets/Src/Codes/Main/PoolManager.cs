using Protocol;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PoolManager : MonoBehaviour
{
    // 프리펩을 보관할 변수
    public GameObject[] prefabs;

    // 풀 담당 하는 리스트들
    List<GameObject> pool;

     // 유저를 관리할 딕셔너리
    Dictionary<string, GameObject> userDictionary = new Dictionary<string, GameObject>();

    void Awake() {
        pool = new List<GameObject>();
    }

    private void Start()
    {
        foreach (Protocol.ObjectInfo playerInfo in NewGameManager.instance.tmp_gameStartPacket.Players)
        {
            string objectId = playerInfo.Posinfo.ObjectId;
            uint prefabIndex = playerInfo.PrefabIndex;
            float x = playerInfo.Posinfo.X;
            float y = playerInfo.Posinfo.Y;

            if (objectId == NewGameManager.instance.deviceId)
            {
                // 자신의 플레이어 위치 설정
                GameManager.instance.player.UpdatePosition(x, y);
            }
            else
            {
                // 다른 플레이어 생성 및 위치 설정
                GameObject player = GameManager.instance.pool.Get(playerInfo.Posinfo, prefabIndex);
                PlayerPrefab playerScript = player.GetComponent<PlayerPrefab>();
                playerScript.UpdatePosition(x, y);
            }
        }
    }

    public GameObject Get(Protocol.PosInfo posInfo, UInt32 prefabIndex) {
        // 유저가 이미 존재하면 해당 유저 반환
        if (userDictionary.TryGetValue(posInfo.ObjectId, out GameObject existingUser))
        {
            return existingUser;
        }

        GameObject select = null;

        // ... 선택한 풀의 놀고 있는(비활성화) 게임 오브젝트 접근
        foreach (GameObject item in pool)
        {
            if (!item.activeSelf)
            {
                select = item;
                select.GetComponent<PlayerPrefab>().Init(prefabIndex, posInfo.ObjectId);
                select.transform.position = new Vector2(posInfo.X, posInfo.Y); // 초기 위치 설정
                select.SetActive(true);
                userDictionary[posInfo.ObjectId] = select;
                break;
            }
        }
        // ... 못 찾으면
        if (select == null) {
            // 새롭게 생성하고 select 변수에 할당
            select = Instantiate(prefabs[0], transform);
            pool.Add(select);
            select.GetComponent<PlayerPrefab>().Init(prefabIndex, posInfo.ObjectId);
            userDictionary[posInfo.ObjectId] = select;
            Debug.Log("못찾음 ㅇㅇ");
        }

        return select;
    }

    public void Remove(string userId) {
        if (userDictionary.TryGetValue(userId, out GameObject userObject)) {
            Debug.Log($"Removing user: {userId}");
            userObject.SetActive(false);
            userDictionary.Remove(userId);
        } else {
            Debug.Log($"User {userId} not found in dictionary");
        }
    }
}
