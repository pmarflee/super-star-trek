import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ShortRangeSensorScanResult } from '../../game/game';
import { EntityType } from '../../game/entities';
import { PhotonTorpedoCalculatorCommand, SectorNavigationCalculatorCommand } from '../../game/commands';

@Component({
  name: 'short-range-sensor-scan',
  template: require('./shortrangesensorscan.html'),
})
export class ShortRangeSensorScanComponent extends Vue {
  @Prop() sectors: ShortRangeSensorScanResult[][];
  @Prop() active: boolean;

  sectorClicked(sector: ShortRangeSensorScanResult): void {
    if (this.active && sector.allowsSelection) {
      if (sector.containsKlingon) {
        this.$emit('command', new PhotonTorpedoCalculatorCommand(sector.row, sector.column));
      } else {
        this.$emit('command', new SectorNavigationCalculatorCommand(sector.row, sector.column));
      }
    }
  }
}
