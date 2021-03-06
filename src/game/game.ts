import { RandomNumberGenerator } from './rng';
import Quadrant from './quadrant';
import Sector from './sector';
import * as Entities from './entities';
import * as LiteEvents from './events';
import * as GameEvents from './gameevents';
import { quadrantNames } from './quadrantnames';

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
  isInProgress: boolean;
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
  isDocked: boolean;
  isDestroyed: boolean;
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
  allowsSelection: boolean;
}

export interface DirectionDistanceCalculationResult {
  verb: string;
  direction: number;
  distance: number;
}

export interface Position {
  row: number;
  column: number;
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

  public readonly event = new LiteEvents.LiteEvent<GameEvents.GameEvent>();

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

  public raiseEvent(event: GameEvents.GameEvent): void {
    this.event.trigger(event);
  }

  public raiseSimpleEvent(...messages: string[]): void {
    this.event.trigger(new GameEvents.SimpleGameEvent(...messages));
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
    if (this.quadrant.numberOfKlingons > 0) return 'Red';
    else if (this.ship.energy < 300) return 'Yellow';
    return 'Green';
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

  get isInProgress(): boolean {
    return !this.ship.isDestroyed
      && this.ship.energy > 0
      && this.klingons > 0
      && this.timeRemaining > 0;
  }

  get currentState(): GameState {
    return {
      isInProgress: this.isInProgress,
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
      isDocked: this.ship.isDocked,
      isDestroyed: this.ship.isDestroyed
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
          ship: quadrant.hasShip,
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
          containsStar: sector.containsStar,
          allowsSelection: !sector.containsEntity || sector.containsKlingon
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
    if (this.ship.shieldControlDamage > 0) {
      throw new Error('Shield controls are malfunctioning.');
    }
    this.ship.adjustShields(amount);
    this.raiseSimpleEvent(`Shields ${amount > 0 ? 'increased' : 'decreased'} by ${Math.abs(amount)} to ${this.shields}`);
  }

  public klingonsAttack(rng: RandomNumberGenerator = this.rng): void {
    for (let klingon of this.quadrant.klingons) {
      if (!this.ship.isDocked) {
        let damage = this.getPhaserDamage(klingon, this.ship, rng);
        this.ship.shields -= Math.floor(damage);
        if (this.ship.shields < 0) {
          this.ship.shields = 0;
          this.ship.isDestroyed = true;
        }
        this.raiseEvent(new GameEvents.EnterpriseHitByKlingonEvent(this.ship, klingon));
        if (this.ship.isDestroyed) return;
      }
    }
  }

  public firePhasers(phaserEnergy: number): void {
    this.ship.firePhasers(phaserEnergy, this);
  }

  public firePhotonTorpedoes(direction: number): void {
    this.ship.firePhotonTorpedoes(direction, this);
  }

  public getPhaserDamage(entity1: Entities.Entity, entity2: Entities.Entity,
    rng: RandomNumberGenerator): number {
    let distance = this.computeDistance(
      entity1.sector.row, entity1.sector.column, entity2.sector.row, entity2.sector.column);
    return Math.floor(300 * rng.next() * (1 - distance / 11.3));
  }

  public navigationCalculator(row: number, column: number): DirectionDistanceCalculationResult {
    if (this.ship.computerDamage > 0) {
      throw new Error('The main computer is damaged. Repairs are underway.');
    }
    let targetQuadrant = this.quadrants[row][column];
    if (targetQuadrant === this.quadrant) {
      throw new Error('That is the current location of the Enterprise.');
    }
    return {
      verb: 'nav',
      direction: this.computeDirection(this.quadrant, targetQuadrant),
      distance: this.computeDistance(
        this.quadrant.column, this.quadrant.row, targetQuadrant.column, targetQuadrant.row)
    };
  }

  public sectorNavigationCalculator(row: number, column: number, verb: string)
    : DirectionDistanceCalculationResult {
    if (this.ship.computerDamage > 0) {
      throw new Error('The main computer is damaged. Repairs are underway.');
    }
    let targetSector = this.quadrant.sectors[row][column];
    return {
      verb: verb,
      direction: this.computeDirection(this.sector, targetSector),
      distance: +((this.computeDistance(
        this.sector.column, this.sector.row, targetSector.column, targetSector.row) / 8).toFixed(2))
    };
  }

  private computeDirection(position1: Position, position2: Position): number {
    let direction = 0;
    if (position1.column === position2.column) {
      direction = position1.row < position2.row ? 7 : 3;
    } else if (position1.row === position2.row) {
      direction = position1.column < position2.column ? 1 : 5;
    } else {
      let directionRow = Math.abs(position2.row - position1.row),
        directionColumn = Math.abs(position2.column - position1.column),
        angle = Math.atan2(directionRow, directionColumn);
      if (position1.column < position2.column) {
        direction = position1.row < position2.row
          ? 9 - 4 * angle / Math.PI
          : 1 + 4 * angle / Math.PI;
      } else {
        direction = position1.row < position2.row
          ? 5 + 4 * angle / Math.PI
          : 5 - 4 * angle / Math.PI;
      }
    }

    return +(direction.toFixed(2));
  }

  private computeDistance(
    sector1Column: number, sector1Row: number,
    sector2Column: number, sector2Row: number): number {
    let column = sector2Column - sector1Column,
      row = sector2Row - sector1Row;
    return +(Math.sqrt(row * row + column * column).toFixed(2));
  }

  private static createQuadrants(maxKlingons: number, maxStarbases: number,
    rng: RandomNumberGenerator): Quadrant[][] {
    let quadrants = Array.from(new Array(Quadrant.rows), (row, rowIndex) =>
        Array.from(new Array(Quadrant.columns), (col, colIndex) =>
          new Quadrant(
            quadrantNames[(rowIndex * Quadrant.rows) + colIndex],
            rowIndex, colIndex, rng.nextInt(1, Game.max_stars)))),
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
