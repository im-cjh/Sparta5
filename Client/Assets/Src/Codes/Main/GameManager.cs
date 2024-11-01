using System;
using System.Collections;
using Unity.Mathematics;
using UnityEngine;
using UnityEngine.SceneManagement;
using Random = UnityEngine.Random;

public class GameManager : MonoBehaviour
{
    public static GameManager instance;

    [Header("# Game Control")]
    public bool isLive;
    public float gameTime;
    
    [Header("# Game Object")]
    public PoolManager pool;
    public Player player;
    public GameObject hud;
    public GameObject GameStartUI;

    void Awake() {
        instance = this;
    }

    void Start()
    {
        GameStart();
    }

    //public void GameStart(InitialData data) {
    public void GameStart() {
        //player.UpdatePosition(data.x, data.y);
        player.gameObject.SetActive(true);
        hud.SetActive(true);
        GameStartUI.SetActive(false);
        isLive = true;

        AudioManager.instance.PlayBgm(true);
        AudioManager.instance.PlaySfx(AudioManager.Sfx.Select);
    }

    public void GameOver() {
        StartCoroutine(GameOverRoutine());
    }

    IEnumerator GameOverRoutine() {
        isLive = false;
        yield return new WaitForSeconds(0.5f);

        AudioManager.instance.PlayBgm(true);
        AudioManager.instance.PlaySfx(AudioManager.Sfx.Lose);
    }

    public void GameRetry() {
        SceneManager.LoadScene(0);
    }

    public void GameQuit() {
        Application.Quit();
    }

    void Update()
    {
        if (!isLive) {
            return;
        }
        gameTime += Time.deltaTime;
    }

    public void SendLocationUpdatePacket(float x, float y)
    {
        Protocol.C2B_Move pkt = new Protocol.C2B_Move();
        pkt.ObjectType = Protocol.ObjectType.Creature;
        pkt.PosInfo = new Protocol.PosInfo
        {
            ObjectId = NewGameManager.instance.deviceId,
            X = x,
            Y = y   
        };
        pkt.RoomId = NewGameManager.instance.roomId;
        
        byte[] sendBuffer = PacketUtils.SerializePacket(pkt, ePacketID.C2B_Move, NewGameManager.instance.GetNextSequence());
        NetworkManager.instance.SendBattlePacket(sendBuffer);
    }
}
