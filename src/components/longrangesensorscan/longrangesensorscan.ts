import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { LongRangeSensorScanResult } from '../../game/game';

@Component({
  name: 'long-range-sensor-scan',
  template: require('./longrangesensorscan.html'),
})
export class LongRangeSensorScanComponent extends Vue {
  @Prop() quadrants: LongRangeSensorScanResult[][];
  @Prop() active: boolean;
}
