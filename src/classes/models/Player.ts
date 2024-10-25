import { Session } from '../../session/session';
import { GameObject } from './GameObject';

/*---------------------------------------------
    [주의사항]

    - Player는 Game 서버에서 사용할 것
    - 나중에 분리될 예정
---------------------------------------------*/
class Player extends GameObject {
  /*---------------------------------------------
    [멤버 변수]
---------------------------------------------*/
  public session: Session; //순환참조 걱정X

  /*---------------------------------------------
    [생성자]
---------------------------------------------*/
  constructor(session: Session) {
    super();
    this.session = session;
  }
}

export default Player;
