import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'system-status',
  template: require('./systemstatus.html'),
})
export class SystemStatusComponent extends Vue {
  @Prop() navigationSystemStatus: string;
  @Prop() shortRangeScanSystemStatus: string;
  @Prop() longRangeScanSystemStatus: string;
  @Prop() shieldControlSystemStatus: string;
  @Prop() computerSystemStatus: string;
  @Prop() photonSystemStatus: string;
  @Prop() phaserSystemStatus: string;
}
