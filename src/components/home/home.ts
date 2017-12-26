import { Component, Vue } from 'vue-property-decorator';
import { Game, LongRangeSensorScanResult } from '../../game/game';
import * as Entities from '../../game/entities';
import Sector from '../../game/sector';
import { LongRangeSensorScanComponent } from '../longrangesensorscan/';
import { ShortRangeSensorScanComponent } from '../shortrangesensorscan/';
import { SystemStatusComponent } from '../systemstatus';

import './home.scss';

@Component({
  template: require('./home.html'),
  components: {
    LongRangeSensorScanComponent,
    ShortRangeSensorScanComponent,
    SystemStatusComponent
  }
})
export class HomeComponent extends Vue {

  public game: Game;
  public ship: Entities.Ship;

  created() {
    this.game = new Game({ seed: 1 });
    this.ship = this.game.ship;
  }

  get longRangeSensorScan(): LongRangeSensorScanResult[][] {
    return this.game.longRangeSensorScan;
  }

  get shortRangeSensorScan(): Sector[][] {
    return this.game.shortRangeSensorScan;
  }

  get navigationDamage(): number {
    return this.ship.navigationDamage;
  }

  get shortRangeScanDamage(): number {
    return this.ship.shortRangeScanDamage;
  }

  get longRangeScanDamage(): number {
    return this.ship.longRangeScanDamage;
  }

  get shieldControlDamage(): number {
    return this.ship.shieldControlDamage;
  }

  get computerDamage(): number {
    return this.ship.computerDamage;
  }

  get photonDamage(): number {
    return this.ship.photonDamage;
  }

  get phaserDamage(): number {
    return this.ship.phaserDamage;
  }
}
