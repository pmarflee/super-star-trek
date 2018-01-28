import { Component, Vue } from 'vue-property-decorator';
import { NewGameComponent } from '../newgame';

import './home.scss';

@Component({
  template: require('./home.html'),
  components: { NewGameComponent }
})
export class HomeComponent extends Vue {
  newGame(seed: number): void {
    let seedString = seed ? seed.toString() : null;
    this.$router.push({ name: 'game', params: { seed: seedString } });
  }
}
