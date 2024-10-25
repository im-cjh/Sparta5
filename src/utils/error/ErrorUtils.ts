import { config } from '../../config/config';
import { Session } from '../../session/session';
import CustomError from './CustomeError';
import { ErrorCodes } from './ErrorCodes';

export class ErrorUtils {
  static clientVersionValidate(clientVersion: string) {
    if (clientVersion !== config.client.version) {
      throw new CustomError(ErrorCodes.CLIENT_VERSION_MISMATCH, '클라이언트 버전이 일치하지 않습니다.');
    }
  }
}
