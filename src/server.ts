import net, { Server, Socket } from 'net';
import initServer from './init';
import { config } from './config/config';
import { onConnection } from './events/onConnection';

const PORT: number = 5555;

const server: Server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행 중입니다.`);
      console.log(server.address());
    });
  })
  .catch((error: any) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
