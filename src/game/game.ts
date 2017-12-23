import Prando from 'prando';
import Quadrant from './quadrant';
import GameState from './gamestate';
import Ship from './ship';

export default class Game {

  private static readonly max_stars: number = 8;
  private static readonly max_starbases: number = 8;

  private readonly rng: Prando;
  public readonly quadrants: Quadrant[][];
  public klingons: number;
  public starbases: number;
  public ship: Ship;

  constructor(state: GameState) {
    this.rng = new Prando(state.seed);

    if (state.seed) {
      state = this.createFromSeed(state.seed);
    }

    this.quadrants = state.quadrants;
    this.klingons = state.klingons;
    this.starbases = state.starbases;
    this.ship = state.ship;
  }

  public createFromSeed(seed: number): GameState {
    var klingons = 15 + this.rng.nextInt(0, 5),
      starbases = 2 + this.rng.nextInt(0, 2),
      quadrants = this.createQuadrants(klingons, starbases),
      ship = this.createShip(quadrants);

    return {
      klingons: klingons,
      starbases: starbases,
      quadrants: quadrants,
      ship: ship
    };
  }

  private createQuadrants(maxKlingons: number, maxStarbases: number): Quadrant[][] {
    var quadrants = Array.from(new Array(Quadrant.rows), (row, rowIndex) =>
      Array.from(new Array(Quadrant.columns), (col, colIndex) => {
        return new Quadrant(
          this.rng.nextInt(1, Game.max_stars),
          rowIndex + 1,
          colIndex + 1,
          this.rng);
      })),
      klingons = 0,
      starbases = 0;

    do {
      let quadrant = this.getRandomQuadrant(quadrants);

      if (quadrant.klingons < 3) {
        quadrant.klingons++;
        klingons++;
      }
    } while (klingons < maxKlingons);

    do {
      let quadrant = this.getRandomQuadrant(quadrants);

      if (!quadrant.hasStarbase) {
        quadrant.hasStarbase = true;
        starbases++;
      }
    } while (starbases < maxStarbases);

    return quadrants;
  }

  private createShip(quadrants: Quadrant[][]): Ship {
    var quadrant = this.getRandomQuadrant(quadrants),
      sector = quadrant.getRandomSector();

    return new Ship(this, quadrant, sector);
  }

  private getRandomQuadrant(quadrants: Quadrant[][]): Quadrant {
      let row = this.rng.nextInt(0, Quadrant.rows - 1),
        column = this.rng.nextInt(0, Quadrant.columns - 1);

      return quadrants[row][column];
  }
}
