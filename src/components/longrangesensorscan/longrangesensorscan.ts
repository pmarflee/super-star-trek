import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { LongRangeSensorScanResult } from '../../game/game';
import { NavigationCalculatorCommand } from '../../game/commands';

@Component({
  name: 'long-range-sensor-scan',
  template: require('./longrangesensorscan.html'),
})
export class LongRangeSensorScanComponent extends Vue {
  @Prop() quadrants: LongRangeSensorScanResult[][];
  @Prop() active: boolean;
  @Prop() computerActive: boolean;

  quadrantClicked(quadrant: LongRangeSensorScanResult): void {
    if (this.active && this.computerActive && !quadrant.ship) {
      this.$emit('command', new NavigationCalculatorCommand(quadrant.row, quadrant.column));
    }
  }
}
