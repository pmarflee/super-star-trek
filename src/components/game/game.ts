import { Component, Vue, Prop } from 'vue-property-decorator';
import Prando from 'prando';
import { Game, LongRangeSensorScanResult, GameState } from '../../game/game';
import * as Entities from '../../game/entities';
import Quadrant from '../../game/quadrant';
import Sector from '../../game/sector';
import * as Commands from '../../game/commands';
import { LongRangeSensorScanComponent } from '../longrangesensorscan/';
import { ShortRangeSensorScanComponent } from '../shortrangesensorscan/';
import { SystemStatusComponent } from '../systemstatus';
import { GameStatsComponent } from '../gamestats';
import { CommandInputComponent } from '../commandinput';
import { GameEvent } from '../../game/gameevents';

import './game.scss';

@Component({
  template: require('./game.html'),
  components: {
    LongRangeSensorScanComponent,
    ShortRangeSensorScanComponent,
    SystemStatusComponent,
    GameStatsComponent,
    CommandInputComponent
  }
})
export class GameComponent extends Vue {

  @Prop() public seed: string;

  public game: Game;
  public gameState: GameState; 
  public ship: Entities.Ship;
  public messages: string[] = [];

  created() {
    this.game = Game.fromRandom(new Prando(this.seed));
    this.ship = this.game.ship;
    this.gameState = this.game.currentState;
    this.game.event.on(event => this.addMessage(...event.messages.reverse()));
  }

  executeCommand(command: Commands.Command): void {
    command.execute(this.game);
    this.gameState = this.game.currentState;
    if (this.gameState.shortRangeScanDamage === 0) {
      switch (this.gameState.condition) {
        case 'Red':
          this.addMessage(
            `Condition RED. Klingon ship${this.gameState.klingonsInQuadrant > 1 ? 's' : ''} detected.`);
          if (this.gameState.shields === 0 && !this.gameState.isDocked) {
            this.addMessage('Warning: Shields are down.');
          }
          break;
        case 'Yellow':
          this.addMessage('Condition YELLOW. Low energy level.');
          break;
      }
    }
    this.$forceUpdate();
  }

  private addMessage(...messages: string[]): void {
    this.messages.unshift(...messages);
  }
}
