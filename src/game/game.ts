import Prando from 'prando';
import Quadrant from './quadrant';
import GameState from './gamestate';
import Ship from './ship';

export interface LongRangeSensorScanResult {
  ship: boolean,
  klingons: number,
  starbases: number,
  stars: number
}

export class Game {

  public static readonly max_stars: number = 8;

  private readonly rng: Prando;
  public readonly quadrants: Quadrant[][];
  public klingons: number;
  public starbases: number;
  public ship: Ship;
  public stardate: number;
  public timeRemaining: number;

  constructor(state: GameState) {
    this.rng = new Prando(state.seed);

    var gameState = state.seed ? this.createFromSeed(state.seed) : state;

    this.quadrants = gameState.quadrants;
    this.klingons = gameState.klingons;
    this.starbases = gameState.starbases;
    this.ship = gameState.ship;
    this.stardate = gameState.stardate;
    this.timeRemaining = gameState.timeRemaining;
  }

  public createFromSeed(seed: number): GameState {
    var rng = this.rng,
      klingons = 15 + rng.nextInt(0, 5),
      starbases = 2 + rng.nextInt(0, 2),
      quadrants = this.createQuadrants(klingons, starbases),
      ship = this.createShip(quadrants),
      stardate = rng.nextInt(0, 50) + 2250,
      timeRemaining = rng.nextInt(0, 9) + 40;

    return {
      klingons: klingons,
      starbases: starbases,
      quadrants: quadrants,
      ship: ship,
      stardate: stardate,
      timeRemaining: timeRemaining
    };
  }

  public longRangeSensorScan(): LongRangeSensorScanResult[][] {
    return this.quadrants.map(
      row => row.map(
        q => <LongRangeSensorScanResult>{
          ship: q === this.ship.quadrant,
          klingons: q.klingons,
          starbases: q.hasStarbase ? 1 : 0,
          stars: q.stars
        }));
  }

  private createQuadrants(maxKlingons: number, maxStarbases: number): Quadrant[][] {
    var quadrants = Array.from(new Array(Quadrant.rows), (row, rowIndex) =>
      Array.from(new Array(Quadrant.columns), (col, colIndex) =>
        new Quadrant(rowIndex + 1, colIndex + 1, this.rng.nextInt(1, Game.max_stars)))),
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
      sector = quadrant.getRandomSector(this.rng);

    return new Ship(quadrant, sector);
  }

  private getRandomQuadrant(quadrants: Quadrant[][]): Quadrant {
      let row = this.rng.nextInt(0, Quadrant.rows - 1),
        column = this.rng.nextInt(0, Quadrant.columns - 1);

      return quadrants[row][column];
  }
}
