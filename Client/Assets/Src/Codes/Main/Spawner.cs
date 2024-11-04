using Protocol;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
public class Spawner : MonoBehaviour
{
    public static Spawner instance;
    private HashSet<string> currentUsers = new HashSet<string>();
    
    void Awake() {
        instance = this;
    }

    public void Spawn(Protocol.B2C_Move moveData) {
        if (!GameManager.instance.isLive) 
        {
            return;
        }

        HashSet<string> newUsers = new HashSet<string>();

        
        PosInfo posInfo = moveData.ObjectInfo.Posinfo;
        UInt32 prefabInex = moveData.ObjectInfo.PrefabIndex;
        string objectId = posInfo.ObjectId;
        float x = posInfo.X;
        float y = posInfo.Y;
        //Debug.Log(objectId + " : " + NewGameManager.instance.deviceId);

        // 내가 보낸 정보
        if (objectId == NewGameManager.instance.deviceId)
        {
            GameManager.instance.player.UpdatePosition(x, y);
        }
        //남이 보낸 정보
        else
        {
            newUsers.Add(objectId);
            // 객체 풀에서 객체 가져오기 또는 생성
            GameObject player = GameManager.instance.pool.Get(posInfo, moveData.ObjectInfo.PrefabIndex);
            if (player != null)
            {
                PlayerPrefab playerScript = player.GetComponent<PlayerPrefab>();
                playerScript.UpdatePosition(x, y);
                //Debug.Log("찾음");
            }
            else Debug.Log("못찾음");
        }

        // 현재 존재하지 않는 사용자를 제거하여 동기화 유지
        foreach (string userId in currentUsers)
        {
            if (!newUsers.Contains(userId))
            {
                GameManager.instance.pool.Remove(userId);
            }
        }

        currentUsers = newUsers;
    }
}