import { Session } from '../session/session';

/*---------------------------------------------
    [기본 핸들러]
    - S2C 패킷들을 무시하기 위함
    - Partial 키워드로 대체 가능
    - ePacketId만 정의해놓고 매핑안하면 컴파일로 미리 에러 잡기 위해
---------------------------------------------*/
const defaultHandler = async (buffer: Buffer, session: Session) => {
  return;
};

export default defaultHandler;
