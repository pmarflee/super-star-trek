import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CommandParser from '../../game/commandparser';

@Component({
  name: 'command-input',
  template: require('./commandinput.html'),
})
export class CommandInputComponent extends Vue {
  @Prop() disabled: boolean;
  @Prop() value: string;

  commandInput: string = '';

  get textInputElement(): any {
    return (<any>this.$refs.textInput);
  }

  mounted() {
    setTimeout(() => {
      this.textInputElement.focus();
    });
  }

  @Watch('value')
  onPropertyChanged(value: string, oldValue: string) {
    this.commandInput = value;
  }

  updateCommand(commandInput: string) {
    this.commandInput = commandInput;
  }

  execute(event: Event) {
    let parser = new CommandParser();

    try {
      let command = parser.parse(this.commandInput);
      this.$emit('command', command);
      this.textInputElement.value = '';
    } catch (e) {
      alert(e);
    }
  }
}
