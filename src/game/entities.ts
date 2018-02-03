import { RandomNumberGenerator } from './rng';
import { Game } from './game';
import Quadrant from './quadrant';
import Sector from './sector';
import { Position } from './game';

export enum EntityType {
  None = 0,
  Ship = 1,
  Klingon = 2,
  Starbase = 3,
  Star = 4
}

export abstract class Entity {
  type: EntityType;
  sector: Sector;
}

export class Ship implements Entity {
  private static readonly min_direction = 1.0;
  private static readonly max_direction = 8.9;

  private static readonly min_distance = 0.1;
  private static readonly max_distance = 8;

  private static readonly offsets: Position[] = [
    { row: -1, column: -1 },
    { row: -1, column: 0 },
    { row: -1, column: 1 },
    { row: 0, column: 1 },
    { row: 1, column: 1 },
    { row: 1, column: 0 },
    { row: 1, column: -1 },
    { row: 0, column: -1 }
  ];

  public quadrant: Quadrant;
  public sector: Sector;
  public energy: number = 3000;
  public photonTorpedoes: number = 10;
  public shields: number = 0;
  public isDestroyed: boolean = false;

  public navigationDamage: number = 0;
  public shortRangeScanDamage: number = 0;
  public longRangeScanDamage: number = 0;
  public shieldControlDamage: number = 0;
  public computerDamage: number = 0;
  public photonDamage: number = 0;
  public phaserDamage: number = 0;

  constructor(quadrant: Quadrant, position: Position, rng: RandomNumberGenerator) {
    this.setQuadrant(quadrant, position, rng);
  }

  public get type(): EntityType {
    return EntityType.Ship;
  } 

  public navigate(
    direction: number,
    distance: number,
    game: Game,
    rng: RandomNumberGenerator = game.rng): void {

    if (direction < Ship.min_direction || direction > Ship.max_direction) {
      throw new Error('Invalid course');
    }

    let maxDistance = this.navigationDamage > 0
      ? 0.2 + rng.nextInt(0, Ship.max_distance) / 10
      : Ship.max_distance;

    if (distance < Ship.min_distance || distance > maxDistance) {
      throw new Error('Invalid warp factor');
    }

    distance *= 8;

    let energyRequired = Math.floor(distance);

    if (energyRequired > this.energy) {
      throw new Error('Insufficient energy');
    }

    this.energy -= energyRequired;

    let previousQuadrant = this.quadrant,
      previousSector = this.sector,
      angle = -(Math.PI * (direction - 1) / 4),
      row = this.quadrant.row * 8 + this.sector.row,
      column = this.quadrant.column * 8 + this.sector.column,
      distanceX = distance * Math.cos(angle),
      distanceY = distance * Math.sin(angle),
      velocityX = distanceX / 1000,
      velocityY = distanceY / 1000;

    for (let i = 0; i < 1000; i++) {
      column += velocityX;
      row += velocityY;
      let rowRounded = Math.round(row),
        columnRounded = Math.round(column),
        quadrantRow = Math.floor(rowRounded / Quadrant.rows),
        quadrantColumn = Math.floor(columnRounded / Quadrant.columns);
      if (quadrantRow === this.quadrant.row && quadrantColumn === this.quadrant.column) {
        let sector = this.quadrant.sectors[rowRounded % Sector.rows][columnRounded % Sector.columns];
        if (sector.containsObstacle) {
          throw new Error(`Obstacle encountered at ${sector.column + 1}, ${sector.row + 1}`);
        }
      }
    }

    if (column < 0) column = 0;
    else if (column > 63) column = 63;

    if (row < 0) row = 0;
    else if (row > 63) row = 63;

    let rowRounded = Math.round(row),
      columnRounded = Math.round(column),
      quadrantRow = Math.floor(rowRounded / Quadrant.rows),
      quadrantColumn = Math.floor(columnRounded / Quadrant.columns),
      sectorRow = rowRounded % Sector.rows,
      sectorColumn = columnRounded % Sector.columns,
      newQuadrant = game.quadrants[quadrantRow][quadrantColumn];

    if (this.quadrant !== newQuadrant) {
      this.setQuadrant(newQuadrant, { row: sectorRow, column: sectorColumn }, rng);
    } else {
      previousSector.entity = null;
      this.setSector(this.quadrant.sectors[sectorRow][sectorColumn]);
    }

    if (this.isDocked) {
      game.addMessage('Lowering shields as part of docking sequence...');
      game.addMessage('Enterprise successfully docked with starbase');
      this.replenishSupplies();
    }

    if (previousQuadrant === newQuadrant) {
      game.klingonsAttack();
    } else {
      game.advanceStardate();
    }
  }

  private setQuadrant(quadrant: Quadrant, position: Position, rng: RandomNumberGenerator) {
    this.quadrant = quadrant;

    quadrant.createSectors();
    quadrant.positionEntities(this, position, rng);
  }

  public setSector(sector: Sector): void {
    sector.entity = this;
    this.sector = sector;
  }

  public adjustShields(amount: number) {
    if ((amount < 0 && Math.abs(amount) > this.shields) || amount > this.energy) {
      throw new Error('Invalid amount of energy');
    }

    amount = Math.floor(amount);

    this.shields += amount;
    this.energy -= amount;
  }

  public get isDocked(): boolean {
    return !this.quadrant.hasStarbase
      ? false
      : Ship.offsets.some(offset => {
        let position = {
          row: this.sector.row + offset.row,
          column: this.sector.column + offset.column
        };
        return position.row >= 0 && position.row < Sector.rows
          && position.column >= 0 && position.column < Sector.columns
          && this.quadrant.sectors[position.row][position.column].containsStarbase;
      });
  }

  private replenishSupplies(): void {
    this.energy = 3000;
    this.photonTorpedoes = 10;
    this.navigationDamage = 0;
    this.shortRangeScanDamage = 0;
    this.longRangeScanDamage = 0;
    this.shieldControlDamage = 0;
    this.computerDamage = 0;
    this.photonDamage = 0;
    this.phaserDamage = 0;
    this.shields = 0;
  }
}

export class Klingon implements Entity {
  constructor(public readonly sector: Sector, public shields: number) {

  }

  public get type(): EntityType {
    return EntityType.Klingon;
  }
}

export class Starbase implements Entity {
  constructor(public readonly sector: Sector) {

  }

  public get type(): EntityType {
    return EntityType.Starbase;
  }
}

export class Star implements Entity {
  constructor(public readonly sector: Sector) {

  }

  public get type(): EntityType {
    return EntityType.Star;
  }
}
