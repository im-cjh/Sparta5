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

        // ���� ���� ����
        if (objectId == NewGameManager.instance.deviceId)
        {
            GameManager.instance.player.UpdatePosition(x, y);
        }
        //���� ���� ����
        else
        {
            newUsers.Add(objectId);
            // ��ü Ǯ���� ��ü �������� �Ǵ� ����
            GameObject player = GameManager.instance.pool.Get(posInfo, moveData.ObjectInfo.PrefabIndex);
            if (player != null)
            {
                PlayerPrefab playerScript = player.GetComponent<PlayerPrefab>();
                playerScript.UpdatePosition(x, y);
                //Debug.Log("ã��");
            }
            else Debug.Log("��ã��");
        }

        // ���� �������� �ʴ� ����ڸ� �����Ͽ� ����ȭ ����
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