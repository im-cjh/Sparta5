import {
  BATTLE_HOST,
  BATTLE_PORT,
  CLIENT_VERSION,
  DB1_HOST,
  DB1_NAME,
  DB1_PASSWORD,
  DB1_PORT,
  DB1_USER,
  DB2_HOST,
  DB2_NAME,
  DB2_PASSWORD,
  DB2_PORT,
  DB2_USER,
  HOST,
  PORT,
} from '../constants/env';

export const lobbyConfig = {
  server: {
    port: PORT,
    host: HOST,
  },
  battleServer: {
    port: BATTLE_PORT,
    host: BATTLE_HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  database: {
    GAME_DB: {
      name: DB1_NAME,
      user: DB1_USER,
      password: DB1_PASSWORD,
      host: DB1_HOST,
      port: DB1_PORT,
    },
    USER_DB: {
      name: DB2_NAME,
      user: DB2_USER,
      password: DB2_PASSWORD,
      host: DB2_HOST,
      port: DB2_PORT,
    },
  },
};
