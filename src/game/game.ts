import Prando from 'prando';
import Quadrant from './quadrant';
import GameState from './gamestate';

export default class Game {

  private static readonly max_stars: number = 8;
  private static readonly max_starbases: number = 8;

  public readonly quadrants: Quadrant[][];
  public klingons: number;
  public starbases: number;

  constructor(state: GameState) {
    this.quadrants = state.quadrants;
    this.klingons = state.klingons;
    this.starbases = state.starbases;
  }

  public static create(seed: number): Game {
    var rng = new Prando(seed),
      klingons = 15 + rng.nextInt(0, 5),
      starbases = 2 + rng.nextInt(0, 2),
      quadrants = this.generateQuadrants(rng, klingons, starbases);

    return new Game({
      klingons: klingons,
      starbases: starbases,
      quadrants: quadrants
    });
  }

  private static generateQuadrants(rng: Prando, maxKlingons: number, maxStarbases: number): Quadrant[][] {

    var quadrants = Array.from(new Array(Quadrant.rows), (row, rowIndex) =>
      Array.from(new Array(Quadrant.columns), (col, colIndex) => {
        return new Quadrant(rng.nextInt(1, Game.max_stars));
      })),
      klingons = 0,
      starbases = 0;

    do {
      let quadrant = Game.getRandomQuadrant(quadrants, rng);

      if (quadrant.klingons < 3) {
        quadrant.klingons++;
        klingons++;
      }
    } while (klingons < maxKlingons);

    do {
      let quadrant = Game.getRandomQuadrant(quadrants, rng);

      if (!quadrant.hasStarbase) {
        quadrant.hasStarbase = true;
        starbases++;
      }
    } while (starbases < maxStarbases);

    return quadrants;
  }

  private static getRandomQuadrant(quadrants: Quadrant[][], rng: Prando): Quadrant {
      let row = rng.nextInt(0, Quadrant.rows - 1),
        column = rng.nextInt(0, Quadrant.columns - 1);

      return quadrants[row][column];
  }
}
