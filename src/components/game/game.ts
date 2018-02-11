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
import { GameEvent, DirectionDistanceCalculationEvent } from '../../game/gameevents';

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
  public command: string = '';

  created() {
    this.game = Game.fromRandom(new Prando(this.seed));
    this.ship = this.game.ship;
    this.gameState = this.game.currentState;
    this.game.event.on(event => {
      if (event instanceof DirectionDistanceCalculationEvent) {
        let directionDistanceCalculationEvent = <DirectionDistanceCalculationEvent>event;
        let result = directionDistanceCalculationEvent.result;
        this.command = result.verb === 'pho'
          ? `${result.verb} ${result.direction}`
          : `${result.verb} ${result.direction} ${result.distance}`;
      } else {
        this.command = '';
      }
      this.addMessage(...event.messages.reverse());
    });
  }

  executeCommand(command: Commands.Command): void {
    command.execute(this.game);
    this.gameState = this.game.currentState;
    if (!this.gameState.isInProgress) {
      if (this.gameState.isDestroyed) {
        this.addMessage('MISSION FAILED: ENTERPRISE DESTROYED!!!');
      } else if (this.gameState.energy === 0) {
        this.addMessage('MISSION FAILED. ENTERPRISE RAN OUT OF ENERGY.');
      } else if (this.gameState.klingons === 0) {
        this.addMessage('MISSION ACCOMPLISHED. ALL KLINGON SHIPS DESTROYED. WELL DONE!!!');
      } else if (this.gameState.timeRemaining === 0) {
        this.addMessage('MISSION FAILED. ENTERPRISE RAN OUT OF TIME.');
      }
    }
    this.$forceUpdate();
  }

  private addMessage(...messages: string[]): void {
    this.messages.unshift(...messages);
  }
}
