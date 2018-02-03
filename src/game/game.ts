import { RandomNumberGenerator } from './rng';
import Quadrant from './quadrant';
import Sector from './sector';
import * as Entities from './entities';

export interface Position {
  row: number;
  column: number;
}

export interface InitialGameState {
  rng: RandomNumberGenerator;
  klingons: number;
  starbases: number;
  quadrants: Quadrant[][];
  ship: Entities.Ship;
  stardate: number;
  timeRemaining: number;
}

export interface GameState {
  inProgress: boolean;
  longRangeSensorScan: LongRangeSensorScanResult[][];
  shortRangeSensorScan: ShortRangeSensorScanResult[][];
  navigationDamage: number;
  shortRangeScanDamage: number;
  longRangeScanDamage: number;
  shieldControlDamage: number;
  computerDamage: number;
  photonDamage: number;
  phaserDamage: number;
  initialKlingons: number;
  initialStarbases: number;
  initialTimeRemaining: number;
  klingons: number;
  starbases: number;
  timeRemaining: number;
  stardate: number;
  condition: string;
  quadrant: Quadrant;
  sector: Sector;
  photonTorpedoes: number;
  energy: number;
  shields: number;
  klingonsInQuadrant: number;
  messages: string[];
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

export interface ShortRangeSensorScanResult {
  row: number;
  column: number;
  containsKlingon: boolean;
  containsShip: boolean;
  containsDestroyedShip: boolean;
  containsStarbase: boolean;
  containsStar: boolean;
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

  constructor(state: InitialGameState) {
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
      acc + row.reduce((acc1, quadrant) => acc1 + quadrant.numberOfKlingons, 0), 0);
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
    return this.quadrant.numberOfKlingons > 0 ? 'Red' : 'Green';
  }

  get photonTorpedoes(): number {
    return this.ship.photonTorpedoes;
  }

  get energy(): number {
    return this.ship.energy;
  }

  get klingonsInQuadrant(): number {
    return this.quadrant.numberOfKlingons;
  }

  get currentState(): GameState {
    return {
      inProgress: !this.ship.isDestroyed,
      longRangeSensorScan: this.longRangeSensorScan,
      shortRangeSensorScan: this.shortRangeSensorScan,
      navigationDamage: this.ship.navigationDamage,
      shortRangeScanDamage: this.ship.shortRangeScanDamage,
      longRangeScanDamage: this.ship.longRangeScanDamage,
      shieldControlDamage: this.ship.shieldControlDamage,
      computerDamage: this.ship.computerDamage,
      photonDamage: this.ship.photonDamage,
      phaserDamage: this.ship.phaserDamage,
      initialKlingons: this.initialKlingons,
      initialStarbases: this.initialStarbases,
      initialTimeRemaining: this.initialTimeRemaining,
      klingons: this.klingons,
      starbases: this.starbases,
      timeRemaining: this.timeRemaining,
      stardate: this.stardate,
      condition: this.condition,
      quadrant: this.quadrant,
      sector: this.sector,
      photonTorpedoes: this.photonTorpedoes,
      energy: this.energy,
      shields: this.shields,
      klingonsInQuadrant: this.klingonsInQuadrant,
      messages: this.messages
    };
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
          klingons: quadrant.scanned ? quadrant.numberOfKlingons : null,
          starbases: quadrant.scanned ? quadrant.hasStarbase ? 1 : 0 : null,
          stars: quadrant.scanned ? quadrant.stars : null,
          scanned: quadrant.scanned
        }));
  }

  public get shortRangeSensorScan(): ShortRangeSensorScanResult[][] {
    return this.ship.quadrant.sectors.map(
      (row, rowIndex) => row.map(
        (sector, columnIndex) => <ShortRangeSensorScanResult>{
          row: rowIndex,
          column: columnIndex,
          containsKlingon: sector.containsKlingon,
          containsShip: sector.containsShip,
          containsDestroyedShip: sector.containsShip && this.ship.isDestroyed,
          containsStarbase: sector.containsStarbase,
          containsStar: sector.containsStar
        }));
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
    this.messages.unshift(message);
  }

  public klingonsAttack(rng: RandomNumberGenerator = this.rng): void {
    for (let klingon of this.quadrant.klingons) {
      if (this.ship.isDocked) {
        this.addMessage(`Enterprise hit by ship at sector ${klingon.sector.toString()}.  No damage due to starbase shields`);
      } else {
        let damage = this.getPhaserDamage(klingon, this.ship, rng);
        this.ship.shields -= Math.floor(damage);
        if (this.ship.shields < 0) {
          this.ship.shields = 0;
          this.ship.isDestroyed = true;
        }
        this.addMessage(`Enterprise hit by ship at sector ${klingon.sector.toString()}.  Shields dropped to ${this.ship.shields}.`);
        if (this.ship.isDestroyed) {
          this.addMessage('MISSION FAILED: ENTERPRISE DESTROYED!!!');
          return;
        }
      }
    }
  }

  public firePhasers(phaserEnergy: number): void {
    if (this.ship.phaserDamage > 0) {
      throw new Error('Phasers are damaged. Repairs are underway.');
    }

    if (this.quadrant.numberOfKlingons === 0) {
      throw new Error('There are no Klingon ships in this quadrant.');
    }

    this.addMessage('Phasers locked on target.');

    for (let i = 0; i < this.quadrant.klingons.length; i++) {
      let klingon = this.quadrant.klingons[i];
      this.ship.energy -= phaserEnergy;
      if (this.ship.energy < 0) {
        this.ship.energy = 0;
        break;
      }
      let phaserDamage = this.getPhaserDamage(this.ship, klingon, this.rng);
      klingon.shields -= phaserDamage;
      if (klingon.shields <= 0) {
        this.quadrant.klingons.splice(i, 1);
        this.quadrant.numberOfKlingons--;
        klingon.sector.entity = null;
        this.addMessage(`Klingon ship destroyed at sector ${klingon.sector.toString()}`);
      } else {
        this.addMessage(`Hit ship at sector ${klingon.sector.toString()}. Klingon shield strength dropped to ${klingon.shields}.`);
      }
      if (this.quadrant.klingons.length > 0) {
        this.klingonsAttack(this.rng);
      }
    }

  }

  private getPhaserDamage(entity1: Entities.Entity, entity2: Entities.Entity,
    rng: RandomNumberGenerator): number {
    let distance = this.getDistanceBetweenSectors(entity1.sector, entity2.sector);
    return Math.floor(300 * rng.next() * (1 - distance / 11.3));
  }

  private getDistanceBetweenSectors(sector1: Sector, sector2: Sector): number {
    let column = sector2.column - sector1.column,
      row = sector2.row - sector1.row;
    return Math.sqrt(row * row + column * column);
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

      if (quadrant.numberOfKlingons < 3) {
        quadrant.numberOfKlingons++;
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
