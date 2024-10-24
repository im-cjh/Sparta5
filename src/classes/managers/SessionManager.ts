import { Socket } from 'net';
import { Session } from '../../session/session';

/*---------------------------------------------
    [SessionManager]
    - 목적: 세션 관리 및 핸들러 함수에서 클라에게 응답할 때 사용
---------------------------------------------*/
class SessionManager {
  /*---------------------------------------------
    [멤버 변수]
      -sessions: 
        클라는 반드시 자신의 uuid를 담아서 패킷을 전송하므로
        빠르게 session을 가져오기 위해 Map선택
---------------------------------------------*/
  private sessions: Set<Session>;

  /*---------------------------------------------
    [생성자]
---------------------------------------------*/
  constructor() {
    this.sessions = new Set<Session>();
  }

  /*---------------------------------------------
    [세션 추가]
---------------------------------------------*/
  addSession(socket: Socket): void {
    this.sessions.add(new Session(socket));
  }

  /*---------------------------------------------
      [getter]
  ---------------------------------------------*/
  getSessionOrNull(uuid: string): Session | null {
    for (const session of this.sessions) {
      if (session.getId() === uuid) {
        return session;
      }
    }
    return null;
  }

  getNextSequenceOrNull(uuid: string): number | null {
    const session: Session | null = this.getSessionOrNull(uuid);
    if (!session) {
      return null;
    }

    return session.getNextSequence();
  }
}

export const sessionManager: SessionManager = new SessionManager();
