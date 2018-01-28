import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ShortRangeSensorScanResult } from '../../game/game';
import { EntityType } from '../../game/entities';

@Component({
  name: 'short-range-sensor-scan',
  template: require('./shortrangesensorscan.html'),
})
export class ShortRangeSensorScanComponent extends Vue {
  @Prop() sectors: ShortRangeSensorScanResult[][];
}
