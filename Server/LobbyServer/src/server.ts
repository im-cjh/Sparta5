import net, { Server, Socket } from 'net';
import { SessionManager } from 'ServerCore/network/SessionManager';
import { lobbyConfig } from './config/config';

import { LobbySession } from './Main/LobbySession';
import { BattleSession } from './Main/BattleSession';
import pools from './db/database';
import { testAllConnections } from './Utils/testDbConnection';
import { onConnection } from './Main/CommonPacketHandler';

const server: Server = net.createServer(onConnection);
/*---------------------------------------------
  [전역 변수]
    - sessionManager: Lobby 서버 세션 관리
    - battleSessionManager: Battle 서버 세션 관리
---------------------------------------------*/
export const sessionManager: SessionManager<LobbySession> = new SessionManager(LobbySession);
export const battleSessionManager: SessionManager<BattleSession> = new SessionManager(
  BattleSession,
);

const initServer = async () => {
  try {
    await testAllConnections(pools);
    // 다음 작업
  } catch (error: any) {
    console.error(error.message);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

initServer()
  .then(() => {
    server.listen(lobbyConfig.server.port, lobbyConfig.server.host, () => {
      console.log(
        `서버가 ${lobbyConfig.server.host}:${lobbyConfig.server.port}에서 실행 중입니다.`,
      );
      console.log('서버 주소:', server.address());
    });
  })
  .catch((error) => {
    console.error('서버 실행 중 오류 발생:', error);
    process.exit(1);
  });
