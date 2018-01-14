import { RandomNumberGenerator } from './rng';
import Quadrant from './quadrant';
import Sector from './sector';
import * as Entities from './entities';

export interface Position {
  row: number;
  column: number;
}

export interface GameState {
  rng: RandomNumberGenerator;
  klingons: number;
  starbases: number;
  quadrants: Quadrant[][];
  ship: Entities.Ship;
  stardate: number;
  timeRemaining: number;
}

export interface LongRangeSensorScanResult {
  row: number;
  column: number;
  ship: boolean;
  klingons: number;
  starbases: number;
  stars: number;
  scanned: boolean;
}

export class Game {

  public static readonly max_stars: number = 8;

  public readonly rng: RandomNumberGenerator;
  public readonly quadrants: Quadrant[][];
  public readonly initialKlingons: number;
  public readonly initialTimeRemaining: number;
  public readonly initialStarbases: number;
  public timeRemaining: number;
  public ship: Entities.Ship;
  public stardate: number;
  public readonly messages: string[] = [];

  constructor(state: GameState) {
    this.rng = state.rng;
    this.quadrants = state.quadrants;
    this.initialKlingons = state.klingons;
    this.initialStarbases = state.starbases;
    this.initialTimeRemaining = state.timeRemaining;
    this.timeRemaining = state.timeRemaining;
    this.ship = state.ship;
    this.stardate = state.stardate;
  }

  public static fromRandom(rng: RandomNumberGenerator): Game {
    let klingons = 15 + rng.nextInt(0, 5),
      starbases = 2 + rng.nextInt(0, 2),
      quadrants = Game.createQuadrants(klingons, starbases, rng),
      ship = Game.createShip(quadrants, rng),
      stardate = rng.nextInt(0, 50) + 2250,
      timeRemaining = rng.nextInt(0, 9) + 40;

    return new Game({
      rng: rng,
      klingons: klingons,
      starbases: starbases,
      quadrants: quadrants,
      ship: ship,
      stardate: stardate,
      timeRemaining: timeRemaining
    });
  }

  public get klingons(): number {
    return this.quadrants.reduce((acc, row) =>
      acc + row.reduce((acc1, quadrant) => acc1 + quadrant.klingons, 0), 0);
  }

  public get starbases(): number {
    return this.quadrants.reduce((acc, row) =>
      acc + row.reduce((acc1, quadrant) => acc1 + (quadrant.hasStarbase ? 1 : 0), 0), 0);
  }

  public get shields(): number {
    return this.ship.shields;
  }

  public get quadrant(): Quadrant {
    return this.ship.quadrant;
  }

  public get sector(): Sector {
    return this.ship.sector;
  }

  get condition(): string {
    return this.quadrant.klingons > 0 ? 'Red' : 'Green';
  }

  get photonTorpedoes(): number {
    return this.ship.photonTorpedoes;
  }

  get energy(): number {
    return this.ship.energy;
  }

  get klingonsInQuadrant(): number {
    return this.quadrant.klingons;
  }

  public get longRangeSensorScan(): LongRangeSensorScanResult[][] {
    let currentQuadrant = this.ship.quadrant;

    for (let row = currentQuadrant.row - 1; row <= currentQuadrant.row + 1; row++) {
      for (let col = currentQuadrant.column - 1; col <= currentQuadrant.column + 1; col++) {
        if (row >= 0 && col >= 0 && row < Quadrant.rows && col < Quadrant.columns) {
          this.quadrants[row][col].scanned = true;
        }
      }
    }

    return this.quadrants.map(
      row => row.map(
        quadrant => <LongRangeSensorScanResult>{
          row: quadrant.row,
          column: quadrant.column,
          ship: quadrant === this.ship.quadrant,
          klingons: quadrant.scanned ? quadrant.klingons : null,
          starbases: quadrant.scanned ? quadrant.hasStarbase ? 1 : 0 : null,
          stars: quadrant.scanned ? quadrant.stars : null,
          scanned: quadrant.scanned
        }));
  }

  public get shortRangeSensorScan(): Sector[][] {
    return this.ship.quadrant.sectors;
  }

  public advanceStardate(): void {
    this.timeRemaining--;
    this.stardate++;
  }

  public moveShip(direction: number, distance: number) {
    this.ship.navigate(direction, distance, this, this.rng);
  }

  public adjustShields(amount: number) {
    this.ship.adjustShields(amount);
  }

  public addMessage(message: string): void {
    this.messages.splice(0, 0, message);
  }

  private static createQuadrants(maxKlingons: number, maxStarbases: number,
    rng: RandomNumberGenerator): Quadrant[][] {
    let quadrants = Array.from(new Array(Quadrant.rows), (row, rowIndex) =>
      Array.from(new Array(Quadrant.columns), (col, colIndex) =>
        new Quadrant(rowIndex, colIndex, rng.nextInt(1, Game.max_stars)))),
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

  private static createShip(quadrants: Quadrant[][], rng: RandomNumberGenerator): Entities.Ship {
    let quadrant = Game.getRandomQuadrant(quadrants, rng),
      position = quadrant.getRandomPosition(rng);

    return new Entities.Ship(quadrant, position, rng);
  }

  private static getRandomQuadrant(quadrants: Quadrant[][], rng: RandomNumberGenerator): Quadrant {
      let row = rng.nextInt(0, Quadrant.rows - 1),
        column = rng.nextInt(0, Quadrant.columns - 1);

      return quadrants[row][column];
  }
}
