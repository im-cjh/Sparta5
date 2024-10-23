import { Utils } from '../../utils/utils';

class AssetManager {
  private stages;

  constructor() {
    this.stages = new Array();
  }

  async loadGameAssets() {
    try {
      const [stages] = await Promise.all([Utils.readFileAsync('stage.json')]);

      //스테이지 자원 로드
      this.stages = stages;

      return { stages: this.stages };
    } catch (error: any) {
      throw new Error('Faild to load game assets: ' + error.message);
    }
  }

  getGameAssets() {
    return { stages: this.stages };
  }
}

export const serverAssetManager = new AssetManager();
