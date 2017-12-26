import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Sector from '../../game/sector';

@Component({
  name: 'short-range-sensor-scan',
  template: require('./shortrangesensorscan.html'),
})
export class ShortRangeSensorScanComponent extends Vue {
  @Prop() sectors: Sector[][];
}
