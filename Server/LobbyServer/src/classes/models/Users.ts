import { LobbySession } from "src/network/LobbySession";

export class User {
  public session: LobbySession;
  public nickname: string | undefined;

  constructor(session: LobbySession, nickname: string | undefined) {
    this.session = session;
    this.nickname = nickname;
  }
}
