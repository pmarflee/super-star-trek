import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'system-status-item',
  template: require('./systemstatusitem.html'),
})
export class SystemStatusItemComponent extends Vue {
  @Prop() name: string;
  @Prop() damage: number;
  @Prop() active: boolean;
}
