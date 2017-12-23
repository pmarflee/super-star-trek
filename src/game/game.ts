import Prando from 'prando';
import Quadrant from './quadrant';
import GameState from './gamestate';
import Ship from './ship';

export default class Game {

  public static readonly max_stars: number = 8;

  private readonly rng: Prando;
  public readonly quadrants: Quadrant[][];
  public klingons: number;
  public starbases: number;
  public ship: Ship;
  public stardate: number;

  constructor(state: GameState) {
    this.rng = new Prando(state.seed);

    var gameState = state.seed ? this.createFromSeed(state.seed) : state;

    this.quadrants = gameState.quadrants;
    this.klingons = gameState.klingons;
    this.starbases = gameState.starbases;
    this.ship = gameState.ship;
    this.stardate = gameState.stardate;
  }

  public createFromSeed(seed: number): GameState {
    var klingons = 15 + this.rng.nextInt(0, 5),
      starbases = 2 + this.rng.nextInt(0, 2),
      quadrants = this.createQuadrants(klingons, starbases),
      ship = this.createShip(quadrants),
      stardate = this.rng.nextInt(0, 50) + 2250;

    return {
      klingons: klingons,
      starbases: starbases,
      quadrants: quadrants,
      ship: ship,
      stardate: stardate
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
