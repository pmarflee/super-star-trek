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

  get navigationSystemStatus(): string {
    return this.getSystemStatus(this.ship.navigationDamage);
  }

  get shortRangeScanSystemStatus(): string {
    return this.getSystemStatus(this.ship.shortRangeScanDamage);
  }

  get longRangeScanSystemStatus(): string {
    return this.getSystemStatus(this.ship.longRangeScanDamage);
  }

  get shieldControlSystemStatus(): string {
    return this.getSystemStatus(this.ship.shieldControlDamage);
  }

  get computerSystemStatus(): string {
    return this.getSystemStatus(this.ship.computerDamage);
  }

  get photonSystemStatus(): string {
    return this.getSystemStatus(this.ship.photonDamage);
  }

  get phaserSystemStatus(): string {
    return this.getSystemStatus(this.ship.phaserDamage);
  }

  private getSystemStatus(damage: number) {
    return damage === 0 ? 'Online' : `Offline - ${damage}`;
  }
}
