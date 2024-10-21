import { Utils } from '../utils/utils';

class AssetManager {
  private mStages;

  constructor() {
    this.mStages = new Array();
  }

  async loadGameAssets() {
    try {
      const [stages] = await Promise.all([Utils.readFileAsync('stage.json')]);

      //스테이지 자원 로드
      this.mStages = stages;

      return { stages: this.mStages };
    } catch (error) {
      throw new Error('Faild to load game assets: ' + error.message);
    }
  }

  getGameAssets() {
    return { stages: this.mStages };
  }
}

export const serverAssetManager = new AssetManager();
