import fs from 'fs';
import path, { resolve } from 'path';
import { PacketHeader } from '../classes/packet';
import { config } from '../config/config';

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

  static readPacketHeader(buffer: Buffer, processLen: number): PacketHeader {
    // processLen 위치에서 id와 size를 각각 읽음
    const id = buffer.readUInt16BE(processLen); // 2바이트
    const size = buffer.readUInt16BE(processLen + config.packet.sizeOfId); //2바이트

    return { id, size };
  }
}
