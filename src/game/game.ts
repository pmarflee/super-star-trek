import Prando from 'prando';
import Quadrant from './quadrant';
import Sector from './sector';
import * as Entities from './entities';

export interface Position {
  row: number;
  column: number;
}

export interface GameState {
  seed?: number;
  klingons?: number;
  starbases?: number;
  quadrants?: Quadrant[][];
  ship?: Entities.Ship;
  stardate?: number;
  timeRemaining?: number;
}

export interface LongRangeSensorScanResult {
  row: number;
  column: number;
  ship: boolean;
  klingons: number;
  starbases: number;
  stars: number;
}

export class Game {

  public static readonly max_stars: number = 8;

  private readonly rng: Prando;
  public readonly quadrants: Quadrant[][];
  public readonly initialKlingons: number;
  public readonly initialTimeRemaining: number;
  public readonly initialStarbases: number;
  public timeRemaining: number;
  public ship: Entities.Ship;
  public stardate: number;

  constructor(state?: GameState) {
    let seed = state && state.seed ? state.seed : undefined;
    this.rng = new Prando(seed);

    let gameState = !state || state.seed ? this.createFromSeed(seed) : state;

    this.quadrants = gameState.quadrants;
    this.initialKlingons = gameState.klingons;
    this.initialStarbases = gameState.starbases;
    this.initialTimeRemaining = gameState.timeRemaining;
    this.timeRemaining = gameState.timeRemaining;
    this.ship = gameState.ship;
    this.stardate = gameState.stardate;
  }

  public createFromSeed(seed: number): GameState {
    let rng = this.rng,
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

  public get klingons(): number {
    return this.quadrants.reduce((acc, row) =>
      acc + row.reduce((acc1, quadrant) => acc1 + quadrant.klingons, 0), 0);
  }

  public get starbases(): number {
    return this.quadrants.reduce((acc, row) =>
      acc + row.reduce((acc1, quadrant) => acc1 + (quadrant.hasStarbase ? 1 : 0), 0), 0);
  }

  public get longRangeSensorScan(): LongRangeSensorScanResult[][] {
    return this.quadrants.map(
      row => row.map(
        q => <LongRangeSensorScanResult>{
          row: q.row,
          column: q.column,
          ship: q === this.ship.quadrant,
          klingons: q.klingons,
          starbases: q.hasStarbase ? 1 : 0,
          stars: q.stars
        }));
  }

  public get shortRangeSensorScan(): Sector[][] {
    return this.ship.quadrant.sectors;
  }

  private createQuadrants(maxKlingons: number, maxStarbases: number): Quadrant[][] {
    let quadrants = Array.from(new Array(Quadrant.rows), (row, rowIndex) =>
      Array.from(new Array(Quadrant.columns), (col, colIndex) =>
        new Quadrant(this.rng, rowIndex + 1, colIndex + 1, this.rng.nextInt(1, Game.max_stars)))),
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

  private createShip(quadrants: Quadrant[][]): Entities.Ship {
    let quadrant = this.getRandomQuadrant(quadrants),
      ship = new Entities.Ship();

    ship.setPosition(quadrant, quadrant.getRandomPosition());

    return ship;
  }

  private getRandomQuadrant(quadrants: Quadrant[][]): Quadrant {
      let row = this.rng.nextInt(0, Quadrant.rows - 1),
        column = this.rng.nextInt(0, Quadrant.columns - 1);

      return quadrants[row][column];
  }
}
