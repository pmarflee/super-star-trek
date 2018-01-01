import { Component, Vue } from 'vue-property-decorator';
import Prando from 'prando';
import { Game, LongRangeSensorScanResult } from '../../game/game';
import * as Entities from '../../game/entities';
import Quadrant from '../../game/quadrant';
import Sector from '../../game/sector';
import { LongRangeSensorScanComponent } from '../longrangesensorscan/';
import { ShortRangeSensorScanComponent } from '../shortrangesensorscan/';
import { SystemStatusComponent } from '../systemstatus';
import { GameStatsComponent } from '../gamestats';

import './home.scss';

@Component({
  template: require('./home.html'),
  components: {
    LongRangeSensorScanComponent,
    ShortRangeSensorScanComponent,
    SystemStatusComponent,
    GameStatsComponent
  }
})
export class HomeComponent extends Vue {

  private static readonly seed = 1;
  public game: Game;
  public ship: Entities.Ship;

  created() {
    this.game = Game.fromSeed(HomeComponent.seed, seed => new Prando(seed));
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

  get initialKlingons(): number {
    return this.game.initialKlingons;
  }

  get initialStarbases(): number {
    return this.game.initialStarbases;
  }

  get initialTimeRemaining(): number {
    return this.game.initialTimeRemaining;
  }

  get klingons(): number {
    return this.game.klingons;
  }

  get starbases(): number {
    return this.game.starbases;
  }

  get timeRemaining(): number {
    return this.game.timeRemaining;
  }

  get stardate(): number {
    return this.game.stardate;
  }

  get condition(): string {
    return this.ship.quadrant.klingons > 0 ? 'Red' : 'Green';
  }

  get quadrant(): Quadrant {
    return this.ship.quadrant;
  }

  get sector(): Sector {
    return this.ship.sector;
  }

  get photonTorpedoes(): number {
    return this.ship.photonTorpedoes;
  }

  get energy(): number {
    return this.ship.energy;
  }

  get shields(): number {
    return this.ship.shields;
  }

  get klingonsInQuadrant(): number {
    return this.ship.quadrant.klingons;
  }

  get messages(): string[] {
    return this.game.messages;
  }
}
