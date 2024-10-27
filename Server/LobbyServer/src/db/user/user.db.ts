import { v4 as uuidv4 } from "uuid";
import pools from "../database";
import { SQL_QUERIES } from "./user.queries";
import { Utils } from "ServerCore/utils/Utils";

export class UserDb {
  static async findUserByDeviceID(deviceId: string) {
    const [rows]: any = await pools.USER_DB.query(
      SQL_QUERIES.FIND_USER_BY_DEVICE_ID,
      [deviceId]
    );
    return Utils.toCamelCase(rows[0]);
  }

  /*---------------------------------------------
    [유저 생성]
        [메모]
            - deviceId를 pk로 한다면 기기가 변경되었을 때, 불러오기가 어렵다.
            - 회원가입, 로그인 기능을 넣으면 굳이 필요없을 것 같다.
            - 안드로이드 SDK 등 deviceId를 요구할 수 있다고 한다...
---------------------------------------------*/
  static async createUser(deviceId: string) {
    const id = uuidv4();
    await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [id, deviceId]);
    return { id, deviceId };
  }

  static async updateUserLogin(id: string) {
    await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
  }
}
