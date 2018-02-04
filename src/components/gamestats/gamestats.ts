import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Quadrant from '../../game/quadrant';
import Sector from '../../game/sector';

@Component({
  name: 'game-stats',
  template: require('./gamestats.html'),
})
export class GameStatsComponent extends Vue {
  @Prop() timeRemaining: number;
  @Prop() stardate: number;
  @Prop() condition: string;
  @Prop() quadrant: Quadrant;
  @Prop() sector: Sector;
  @Prop() photonTorpedoes: number;
  @Prop() energy: number;
  @Prop() shields: number;
  @Prop() klingons: number;
  @Prop() active: boolean;
}
