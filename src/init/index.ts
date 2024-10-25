// 서버 초기화 작업

import { serverAssetManager } from '../classes/managers/AssetManager';
import pools from '../db/database';
import { testAllConnections } from '../test/testDbConnection';

const initServer = async () => {
  try {
    await serverAssetManager.loadGameAssets();
    await testAllConnections(pools);
    // 다음 작업
  } catch (error: any) {
    console.error(error.message);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;
