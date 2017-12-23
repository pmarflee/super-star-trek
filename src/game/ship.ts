import Game from './game';
import Quadrant from './quadrant';
import Sector from './sector';

export default class Ship {
  private readonly game: Game;

  public energy: number = 3000;

  constructor(game: Game, public quadrant: Quadrant, public sector: Sector) {
    this.game = game;
  }
}
