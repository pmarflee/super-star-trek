import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { SystemStatusItemComponent } from '../systemstatusitem';

@Component({
  name: 'system-status',
  template: require('./systemstatus.html'),
  components: {
    SystemStatusItemComponent
  }
})
export class SystemStatusComponent extends Vue {
  @Prop() navigationDamage: number;
  @Prop() shortRangeScanDamage: number;
  @Prop() longRangeScanDamage: number;
  @Prop() shieldControlDamage: number;
  @Prop() computerDamage: number;
  @Prop() photonDamage: number;
  @Prop() phaserDamage: number;
}
