import net, { Server, Socket } from "net";
import initServer from "./init";
import { SessionManager } from "ServerCore/classes/managers/SessionManager";
import { lobbyConfig } from "./config/config";

import { LobbySession } from "./network/LobbySession";
import { onConnection } from "./events/onConnection";
import { BattleSession } from "./network/BattleSession";

const server: Server = net.createServer(onConnection);
/*---------------------------------------------
    [전역 변수]
      -sessionManager: 
---------------------------------------------*/
export const sessionManager: SessionManager<LobbySession> = new SessionManager(
  LobbySession
);

export const battleSessionManager: SessionManager<BattleSession> =
  new SessionManager(BattleSession);

initServer()
  .then(() => {
    server.listen(lobbyConfig.server.port, lobbyConfig.server.host, () => {
      console.log(
        `서버가 ${lobbyConfig.server.host}:${lobbyConfig.server.port}에서 실행 중입니다.`
      );
      console.log(server.address());
    });
  })
  .catch((error: any) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
