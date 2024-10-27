import mysql, {
  FieldPacket,
  Pool,
  QueryOptions,
  QueryResult,
} from "mysql2/promise";
import { lobbyConfig } from "../config/config";

import { DbConfig } from "ServerCore/classes/interfaces/DbConfig";
import { Utils } from "ServerCore/utils/Utils";

const { database } = lobbyConfig;

// 데이터베이스 커넥션 풀 생성 함수
const createPool = (dbConfig: DbConfig): Pool => {
  const pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.name,
    waitForConnections: true,
    connectionLimit: 10, // 커넥션 풀에서 최대 연결 수
    queueLimit: 0, // 0일 경우 무제한 대기열
  });

  const originalQuery = pool.query.bind(pool);

  pool.query = <T extends QueryResult>(
    sql: string | QueryOptions,
    params?: any[]
  ): Promise<[T, FieldPacket[]]> => {
    const date = new Date();
    // 쿼리 실행시 로그
    console.log(
      `[${Utils.formatDate(date)}] Executing query: ${sql} ${
        params ? `, ${JSON.stringify(params)}` : ``
      }`
    );
    if (typeof sql === "string") {
      return originalQuery(sql, params); // 문자열 SQL 쿼리 처리
    } else {
      return originalQuery(sql); // QueryOptions 객체 처리
    }
  };

  return pool;
};

// 여러 데이터베이스 커넥션 풀 생성
const pools = {
  GAME_DB: createPool(database.GAME_DB),
  USER_DB: createPool(database.USER_DB),
};

export default pools;
