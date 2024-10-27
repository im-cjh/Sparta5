import { QueryResult } from "mysql2";
import { Pool } from "mysql2/promise";

const testDbConnection = async (pool: Pool, dbName: string): Promise<void> => {
  try {
    const [rows]: any = await pool.query<QueryResult>(
      "SELECT 1 + 1 AS solution"
    );

    console.log(`${dbName} 테스트 쿼리 결과:`, rows[0].solution);
  } catch (error) {
    console.error(`${dbName} 테스트 쿼리 실행 중 오류 발생:`, error);
  }
};

const testAllConnections = async (pools: {
  GAME_DB: Pool;
  USER_DB: Pool;
}): Promise<void> => {
  await testDbConnection(pools.GAME_DB, "GAME_DB");
  await testDbConnection(pools.USER_DB, "USER_DB");
};

export { testDbConnection, testAllConnections };
