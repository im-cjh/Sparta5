import { BattleSession } from 'src/Main/network/BattleSession';
import { ObjectInfo } from 'src/protocol/struct_pb';

export class GamePlayer {
  public session: BattleSession;
  public playerInfo: ObjectInfo;

  constructor(session: BattleSession, playerInfo: ObjectInfo) {
    this.session = session;
    this.playerInfo = playerInfo;
  }
}
