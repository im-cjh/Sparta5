import { Session } from '../../session/session';
import { GameObject } from './GameObject';

/*---------------------------------------------
    [주의사항]

    - User는 lobby 서버에서 사용할 것
    -  Player는 나중에 분리될 예정
---------------------------------------------*/
class User {
  /*---------------------------------------------
    [멤버 변수]
---------------------------------------------*/
  public session: Session; //순환참조 걱정X

  /*---------------------------------------------
    [생성자]
---------------------------------------------*/
  constructor(session: Session) {
    this.session = session;
  }
}

export default Player;
