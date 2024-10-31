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

    void SendLocationUpdatePacket(float x, float y)
    {
        LocationUpdatePayload locationUpdatePayload = new LocationUpdatePayload
        {
            x = x,
            y = y,
        };

        byte[] sendBuffer = PacketUtils.SerializePacket() 
        NetworkManager.instance.SendBattlePacket()
        //NetworkManager.instance.Send(locationUpdatePayload, (uint)Packets.HandlerIds.LocationUpdate);
    }
}
