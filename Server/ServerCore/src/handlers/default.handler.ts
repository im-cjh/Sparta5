import { Session } from "../network/Session";
import { CustomError } from "../utils/error/CustomError";

import { ErrorCodes } from "../utils/error/ErrorCodes";

/*---------------------------------------------
    [기본 핸들러]
    - S2C 패킷들을 무시하기 위함
    - Partial 키워드로 대체 가능
    - ePacketId만 정의해놓고 매핑안하면 컴파일로 미리 에러 잡기 위해
---------------------------------------------*/
const defaultHandler = async (buffer: Buffer, session: Session) => {
  throw new CustomError(
    ErrorCodes.UNKNOWN_HANDLER_ID,
    `핸들러를 찾을 수 없습니다.`
  );
};

export default defaultHandler;
