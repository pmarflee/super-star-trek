import { Component, Vue } from 'vue-property-decorator';
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
  public gameState: GameState; 
  public ship: Entities.Ship;

  created() {
    this.game = Game.fromRandom(new Prando(HomeComponent.seed));
    this.ship = this.game.ship;
    this.gameState = this.game.currentState;
  }

  executeCommand(command: Commands.Command): void {
    command.execute(this.game);
    this.gameState = this.game.currentState;
    this.$forceUpdate();
  }
}
