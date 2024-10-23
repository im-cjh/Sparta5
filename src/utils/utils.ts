import fs from 'fs';
import path, { resolve } from 'path';

import { config } from '../config/config';

//최상위 경로 + assets 폴더
export class Utils {
  static basePath: string = path.join(__dirname, '../../Assets');
  static protoPath: string = path.join(__dirname, '../protobuf');

  /*---------------------------------------------
    [비동기 파일 읽기]
---------------------------------------------*/
  static async readFileAsync(filename: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(Utils.basePath, filename), 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(data));
      });
    });
  }

  /*---------------------------------------------
    [동기 protobuf 파일 읽기]
---------------------------------------------*/
  static getAllProtoFiles(dir: string = Utils.protoPath, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        this.getAllProtoFiles(filePath, fileList);
      } else if (path.extname(file) === '.proto') {
        fileList.push(filePath);
      }
    });
    return fileList;
  }
}
