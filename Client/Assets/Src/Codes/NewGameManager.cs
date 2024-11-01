using System;
using System.Collections;
using Unity.Mathematics;
using UnityEngine;
using UnityEngine.SceneManagement;
using Random = UnityEngine.Random;

public class NewGameManager : MonoBehaviour
{
    public static NewGameManager instance;

    [Header("# Game Control")]
    public int targetFrameRate;
    public string version = "1.0.0";
    public int latency = 2;
    public UInt32 sequence = 0;

    [Header("# Player Info")]
    public uint playerId;
    public string deviceId;
    public string nickname;
    public UInt32 roomId;

    void Awake()
    {
        instance = this;
        DontDestroyOnLoad(this);
        Application.targetFrameRate = targetFrameRate;
        playerId = (uint)Random.Range(0, 4);
    }

    public UInt32 GetNextSequence()
    {
        return sequence++;
    }
}
