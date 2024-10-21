import { Socket } from 'net';
import { Session } from './session';

class SessionManager {
  private sessions: Set<Session>;

  constructor() {
    this.sessions = new Set<Session>();
  }

  addSession(socket: Socket): void {
    this.sessions.add(new Session(socket));
  }
}

export const sessionManager: SessionManager = new SessionManager();
