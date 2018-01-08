import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'command-input',
  template: require('./commandinput.html'),
})
export class CommandInputComponent extends Vue {
  @Prop() input: string;
}
