import Game from './game';
import Quadrant from './quadrant';
import Sector from './sector';

export default class Ship {
  public energy: number = 3000;
  public photonTorpedoes: number = 10;
  public shields: number = 0;

  constructor(public quadrant: Quadrant, public sector: Sector) {
  }
}
