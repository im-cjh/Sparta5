import { create } from '@bufbuild/protobuf';
import { PosInfo, PosInfoSchema } from '../../common/protobuf/struct_pb';

export class GameObject {
  /*---------------------------------------------
    [멤버 변수]
---------------------------------------------*/
  public posInfo: PosInfo;
  public lastUpdateTime: number;
  /*---------------------------------------------
    [생성자]
---------------------------------------------*/
  constructor() {
    this.posInfo = create(PosInfoSchema, {
      objectId: '',
      y: 0,
      x: 0,
    });

    this.lastUpdateTime = Date.now();
  }

  /*---------------------------------------------
    [위치 갱신]
---------------------------------------------*/
  updatePosition(pos: PosInfo) {
    this.posInfo = pos;
    this.lastUpdateTime = Date.now();
  }
}
