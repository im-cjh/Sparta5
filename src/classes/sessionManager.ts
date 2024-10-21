import { Socket } from 'net';
import { Session } from './session';

class SessionManager {
  private sessions: Set<Session>;

  constructor() {
    this.sessions = new Set<Session>();
  }

  addSession(socket: Socket): void {
    let session = new Session(socket);
    this.sessions.add(session);
  }
}

export const sessionManager: SessionManager = new SessionManager();
