import net, { Server, Socket } from 'net';
import { v4 as uuidv4 } from 'uuid';

import { onConnection } from './Main/onConnection';
import { BattleSession } from './Main/network/BattleSession';
import { LobbySession } from './Main/network/LobbySession';
import { battleConfig } from './config/config';
import initServer from './Main';
import { B2L_InitialPacket, B2L_InitialPacketSchema } from './protocol/server_pb';
import { create } from '@bufbuild/protobuf';
import { PacketUtils } from 'ServerCore/utils/parser/ParserUtils';
import { ePacketId } from 'ServerCore/network/PacketId';
import { SessionManager } from 'ServerCore/network/SessionManager';

const server: Server = net.createServer(onConnection);
/*---------------------------------------------
    [전역 변수]
      -sessionManager: 
---------------------------------------------*/
export const sessionManager: SessionManager<BattleSession> = new SessionManager(BattleSession);

export let lobbySession: LobbySession = new LobbySession(new Socket());
lobbySession.connectLobbyServer();

initServer()
  .then(() => {
    server.listen(battleConfig.server.port, battleConfig.server.host, () => {
      console.log(`서버가 ${battleConfig.server.host}:${battleConfig.server.port}에서 실행 중입니다.`);
      console.log(server.address());
    });
  })
  .catch((error: any) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
