import { Component, Vue } from 'vue-property-decorator';
import Prando from 'prando';

@Component({
  name: 'new-game',
  template: require('./newgame.html'),
})
export class NewGameComponent extends Vue {
  seed: number = null;

  mounted() {
    setTimeout(() => {
      (<any>this.$refs.seedInput).focus();
    });
  }

  public newgame(): void {
    this.$emit('new-game', this.seed || new Prando().nextInt(1, 99999));
  }
}
