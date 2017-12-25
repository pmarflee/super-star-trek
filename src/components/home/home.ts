import { Component, Vue } from 'vue-property-decorator';
import { Game, LongRangeSensorScanResult } from '../../game/game';
import { LongRangeSensorScanComponent } from '../longrangesensorscan/';

import './home.scss';

@Component({
  template: require('./home.html'),
  components: { LongRangeSensorScanComponent }
})
export class HomeComponent extends Vue {

  public game: Game;

  created() {
    this.game = new Game({ seed: 1 });
  }

  get longRangeSensorScan(): LongRangeSensorScanResult[][] {
    return this.game.longRangeSensorScan;
  }

}
