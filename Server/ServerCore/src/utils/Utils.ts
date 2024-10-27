import fs from "fs";
import path, { resolve } from "path";
import camelCase from "lodash/camelCase.js";
import { config } from "../config/config";

/*---------------------------------------------
    [Utils]
    1. Promise<any> readFileAsync(string): 비동기 파일 읽기
    2. any toCamelCase(any): snake_case -> camelCase 변환
   
---------------------------------------------*/
export class Utils {
  static basePath: string = path.join(__dirname, "../../Assets");
  static protoPath: string = path.join(__dirname, "../protobuf");

  /*---------------------------------------------
    [비동기 파일 읽기]
---------------------------------------------*/
  static async readFileAsync(filename: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(Utils.basePath, filename), "utf8", (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(data));
      });
    });
  }

  /*---------------------------------------------
    [snake_case -> camelCase 변환]
---------------------------------------------*/
  static toCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      // 배열인 경우, 배열의 각 요소에 대해 재귀적으로 toCamelCase 함수를 호출
      return obj.map((v) => Utils.toCamelCase(v));
    } else if (
      obj !== null &&
      typeof obj === "object" &&
      obj.constructor === Object
    ) {
      // 객체인 경우, 객체의 키를 카멜케이스로 변환하고, 값에 대해서도 재귀적으로 toCamelCase 함수를 호출
      return Object.keys(obj).reduce(
        (result: Record<string, any>, key: string) => {
          result[camelCase(key)] = Utils.toCamelCase(obj[key]);
          return result;
        },
        {}
      );
    }
    // 객체도 배열도 아닌 경우, 원본 값을 반환
    return obj;
  }

  /*---------------------------------------------
    [Date->문자열 변환]
---------------------------------------------*/
  static formatDate(date: Date): string {
    const year: number = date.getFullYear();
    const month: string = String(date.getMonth() + 1).padStart(2, "0");
    const day: string = String(date.getDate()).padStart(2, "0");
    const hours: string = String(date.getHours()).padStart(2, "0");
    const minutes: string = String(date.getMinutes()).padStart(2, "0");
    const seconds: string = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
