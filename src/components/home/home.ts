import { Component, Vue } from 'vue-property-decorator';
import { Game, LongRangeSensorScanResult } from '../../game/game';
import Sector from '../../game/sector';
import { LongRangeSensorScanComponent } from '../longrangesensorscan/';
import { ShortRangeSensorScanComponent } from '../shortrangesensorscan/';

import './home.scss';

@Component({
  template: require('./home.html'),
  components: { LongRangeSensorScanComponent, ShortRangeSensorScanComponent }
})
export class HomeComponent extends Vue {

  public game: Game;

  created() {
    this.game = new Game({ seed: 1 });
  }

  get longRangeSensorScan(): LongRangeSensorScanResult[][] {
    return this.game.longRangeSensorScan;
  }

  get shortRangeSensorScan(): Sector[][] {
    return this.game.shortRangeSensorScan;
  }
}
