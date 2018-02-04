import { RandomNumberGenerator } from './rng';
import { Game } from './game';
import Quadrant from './quadrant';
import Sector from './sector';
import { Position } from './game';
import * as GameEvents from './gameevents';

export enum EntityType {
  None = 0,
  Ship = 1,
  Klingon = 2,
  Starbase = 3,
  Star = 4
}

export enum DamageType {
  Navigation = 0,
  ShortRangeScan = 1,
  LongRangeScan = 2,
  ShieldControl = 3,
  Computer = 4,
  Photon = 5,
  Phaser = 6
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
      game.advanceStardate();
    } else {
      previousSector.entity = null;
      this.setSector(this.quadrant.sectors[sectorRow][sectorColumn]);
    }

    if (this.isDocked) {
      game.raiseSimpleEvent(
        'Lowering shields as part of docking sequence...',
        'Enterprise successfully docked with starbase');
      this.replenishSupplies();
    } else {
      if (previousQuadrant === this.quadrant && this.quadrant.numberOfKlingons > 0) {
        game.klingonsAttack();
      } else if (!this.repairDamage(game)) {
        this.induceDamage(rng);
      }
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

  private repairDamage(game: Game): boolean {
    if (this.navigationDamage > 0) {
      this.navigationDamage--;
      if (this.navigationDamage === 0) {
        game.raiseSimpleEvent('Warp engines have been repaired.');
      }
      return true;
    }
    if (this.shortRangeScanDamage > 0) {
      this.shortRangeScanDamage--;
      if (this.shortRangeScanDamage === 0) {
        game.raiseSimpleEvent('Short range scanner has been repaired.');
      }
      return true;
    }
    if (this.longRangeScanDamage > 0) {
      this.longRangeScanDamage--;
      if (this.longRangeScanDamage === 0) {
        game.raiseSimpleEvent('Long range scanner has been repaired.');
      }
      return true;
    }
    if (this.shieldControlDamage > 0) {
      this.shieldControlDamage--;
      if (this.shieldControlDamage === 0) {
        game.raiseSimpleEvent('Shield controls have been repaired.');
      }
      return true;
    }
    if (this.computerDamage > 0) {
      this.computerDamage--;
      if (this.computerDamage === 0) {
        game.raiseSimpleEvent('The main computer has been repaired.');
      }
      return true;
    }
    if (this.photonDamage > 0) {
      this.photonDamage--;
      if (this.photonDamage === 0) {
        game.raiseSimpleEvent('Photon torpedo controls have been repaired.');
      }
      return true;
    }
    if (this.phaserDamage > 0) {
      this.phaserDamage--;
      if (this.phaserDamage === 0) {
        game.raiseSimpleEvent('Phasers have been repaired');
      }
      return true;
    }
    return false;
  }

  private induceDamage(rng: RandomNumberGenerator, type?: DamageType): void {
    if (rng.nextInt(0, 7) > 0) return;

    if (type == null || type === undefined) {
      type = rng.nextInt(0, 6);
    }

    let damage = rng.nextInt(1, 6);

    switch (type) {
      case DamageType.Navigation:
        this.navigationDamage = damage;
        break;
      case DamageType.ShortRangeScan:
        this.shortRangeScanDamage = damage;
        break;
      case DamageType.LongRangeScan:
        this.longRangeScanDamage = damage;
        break;
      case DamageType.ShieldControl:
        this.shieldControlDamage = damage;
        break;
      case DamageType.Computer:
        this.computerDamage = damage;
        break;
      case DamageType.Photon:
        this.photonDamage = damage;
        break;
      case DamageType.Phaser:
        this.phaserDamage = damage;
        break;
    }
  }

  public firePhasers(phaserEnergy: number, game: Game, rng: RandomNumberGenerator = game.rng): void {
    if (this.phaserDamage > 0) {
      throw new Error('Phasers are damaged. Repairs are underway.');
    }

    if (this.quadrant.numberOfKlingons === 0) {
      throw new Error('There are no Klingon ships in this quadrant.');
    }

    game.raiseSimpleEvent('Phasers locked on target.');

    for (let i = 0; i < this.quadrant.klingons.length; i++) {
      let klingon = this.quadrant.klingons[i];
      this.energy -= phaserEnergy;
      if (this.energy < 0) {
        this.energy = 0;
        break;
      }
      let phaserDamage = game.getPhaserDamage(this, klingon, rng);
      klingon.shields -= phaserDamage;
      if (klingon.shields <= 0) {
        this.quadrant.klingons.splice(i, 1);
        this.quadrant.numberOfKlingons--;
        klingon.sector.entity = null;
      }
      game.raiseEvent(new GameEvents.KlingonHitByEnterpriseEvent(klingon));
      if (this.quadrant.klingons.length > 0) {
        game.klingonsAttack(rng);
      }
    }

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
