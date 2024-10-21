import fs from 'fs';
import path, { resolve } from 'path';

//최상위 경로 + assets 폴더
export class Utils {
  static basePath: string = path.join(__dirname, '../../Assets');

  //비동기 병렬로 파일을 읽기
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
}
