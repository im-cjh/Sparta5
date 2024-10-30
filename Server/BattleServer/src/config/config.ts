import {
  CLIENT_VERSION,
  HOST,
  LOBBY_HOST,
  LOBBY_PORT,
  PORT,
} from "src/constants/env";

export const battleConfig = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },

  lobbyServer: {
    port: LOBBY_PORT,
    host: LOBBY_HOST,
  },
};
