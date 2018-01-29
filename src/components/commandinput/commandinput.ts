import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CommandParser from '../../game/commandparser';

@Component({
  name: 'command-input',
  template: require('./commandinput.html'),
})
export class CommandInputComponent extends Vue {
  @Prop() disabled: boolean;
  input: string = '';

  mounted() {
    setTimeout(() => {
      (<any>this.$refs.textInput).focus();
    });
  }

  execute(event: Event) {
    let parser = new CommandParser();

    try {
      let input = this.input;
      let command = parser.parse(input);
      this.$emit('command', command);
      this.input = '';
    } catch (e) {
      alert(e);
    }
  }
}
