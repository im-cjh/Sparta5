using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;


public class PacketHandler
{
    public static Dictionary<ePacketID, Action<byte[], ushort>> handlerMapping;

    /*---------------------------------------------
    [생성자]
---------------------------------------------*/
    static PacketHandler()
    {
        handlerMapping = new Dictionary<ePacketID, Action<byte[], ushort>>();
        Init();
    }

    /*---------------------------------------------
    [초기화]
---------------------------------------------*/
    static void Init()
    {
        handlerMapping[ePacketID.L2C_Init] = HandleInitPacket;
    }

    /*---------------------------------------------
    []
---------------------------------------------*/
    static void HandleInitPacket(byte[] pBuffer, ushort pLen)
    {
        //패킷 역직렬화
        Protocol.L2C_Init pkt = Protocol.L2C_Init.Parser.ParseFrom(pBuffer);

        //게임 시작
        InitialData data = new InitialData();
        data.userId = pkt.UserId;
        
        GameManager.instance.GameStart();
    }
}
