import { Component, Vue } from 'vue-property-decorator';
import Prando from 'prando';
import { Game, LongRangeSensorScanResult } from '../../game/game';
import * as Entities from '../../game/entities';
import Quadrant from '../../game/quadrant';
import Sector from '../../game/sector';
import * as Commands from '../../game/commands';
import { LongRangeSensorScanComponent } from '../longrangesensorscan/';
import { ShortRangeSensorScanComponent } from '../shortrangesensorscan/';
import { SystemStatusComponent } from '../systemstatus';
import { GameStatsComponent } from '../gamestats';
import { CommandInputComponent } from '../commandinput';

import './home.scss';

@Component({
  template: require('./home.html'),
  components: {
    LongRangeSensorScanComponent,
    ShortRangeSensorScanComponent,
    SystemStatusComponent,
    GameStatsComponent,
    CommandInputComponent
  }
})
export class HomeComponent extends Vue {

  private static readonly seed = 1;
  public game: Game;
  public ship: Entities.Ship;

  created() {
    this.game = Game.fromRandom(new Prando(HomeComponent.seed));
    this.ship = this.game.ship;
  }

  getLongRangeSensorScan(): LongRangeSensorScanResult[][] {
    return this.game.longRangeSensorScan;
  }

  getShortRangeSensorScan(): Sector[][] {
    return this.game.shortRangeSensorScan;
  }

  getNavigationDamage(): number {
    return this.ship.navigationDamage;
  }

  getShortRangeScanDamage(): number {
    return this.ship.shortRangeScanDamage;
  }

  getLongRangeScanDamage(): number {
    return this.ship.longRangeScanDamage;
  }

  getShieldControlDamage(): number {
    return this.ship.shieldControlDamage;
  }

  getComputerDamage(): number {
    return this.ship.computerDamage;
  }

  getPhotonDamage(): number {
    return this.ship.photonDamage;
  }

  getPhaserDamage(): number {
    return this.ship.phaserDamage;
  }

  getInitialKlingons(): number {
    return this.game.initialKlingons;
  }

  getInitialStarbases(): number {
    return this.game.initialStarbases;
  }

  getInitialTimeRemaining(): number {
    return this.game.initialTimeRemaining;
  }

  getKlingons(): number {
    return this.game.klingons;
  }

  getStarbases(): number {
    return this.game.starbases;
  }

  getTimeRemaining(): number {
    return this.game.timeRemaining;
  }

  getStardate(): number {
    return this.game.stardate;
  }

  getCondition(): string {
    return this.game.condition;
  }

  getQuadrant(): Quadrant {
    return this.game.quadrant;
  }

  getSector(): Sector {
    return this.game.sector;
  }

  getPhotonTorpedoes(): number {
    return this.game.photonTorpedoes;
  }

  getEnergy(): number {
    return this.game.energy;
  }

  getShields(): number {
    return this.game.shields;
  }

  getKlingonsInQuadrant(): number {
    return this.game.klingonsInQuadrant;
  }

  getMessages(): string[] {
    return this.game.messages;
  }

  executeCommand(command: Commands.Command): void {
    command.execute(this.game);
    this.$forceUpdate();
  }
}
