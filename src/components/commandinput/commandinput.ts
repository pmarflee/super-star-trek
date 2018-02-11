import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CommandParser from '../../game/commandparser';

@Component({
  name: 'command-input',
  template: require('./commandinput.html'),
})
export class CommandInputComponent extends Vue {
  @Prop() disabled: boolean;
  @Prop() value: string;

  get textInputElement(): any {
    return (<any>this.$refs.textInput);
  }

  mounted() {
    setTimeout(() => {
      this.textInputElement.focus();
    });
  }

  execute(event: Event) {
    let parser = new CommandParser();

    try {
      let command = parser.parse(this.textInputElement.value);
      this.$emit('command', command);
      this.textInputElement.value = '';
    } catch (e) {
      alert(e);
    }
  }
}
