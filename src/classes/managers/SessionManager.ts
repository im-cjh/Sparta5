import { Socket } from 'net';
import { Session } from '../../session/session';
import { v4 as uuidv4 } from 'uuid';
class SessionManager {
  private sessions: Map<string, Session>;

  constructor() {
    this.sessions = new Map<string, Session>();
  }

  addSession(socket: Socket, uuid: string): void {
    this.sessions.set(uuid, new Session(socket, uuid));
  }

  getSessionOrNull(uuid: string): Session | null {
    const ret: Session | undefined = this.sessions.get(uuid);
    if (ret != undefined) return ret;
    else return null;
  }
}

export const sessionManager: SessionManager = new SessionManager();
export const gameSessionManager: SessionManager = new SessionManager();
