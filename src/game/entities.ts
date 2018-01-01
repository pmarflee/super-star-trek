import { RandomNumberGenerator } from './rng';
import Game from './game';
import Quadrant from './quadrant';
import Sector from './sector';
import { Position } from './game';

export interface Entity {

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

  public navigate(direction: number, distance: number, rng: RandomNumberGenerator): void {
    if (direction < Ship.min_direction || direction > Ship.max_direction) {
      throw new Error('Invalid course');
    }

    let maxDistance = this.navigationDamage > 0
      ? 0.2 + rng.nextInt(0, Ship.max_distance) / 10
      : Ship.max_distance;

    if (distance < Ship.min_distance || distance > maxDistance) {
      throw new Error('Invalid warp factor');
    }

    let energyRequired = Math.floor(distance * 8);

    if (energyRequired > this.energy) {
      throw new Error('Insufficient energy');
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

  public get isDocked(): boolean {
    return !this.quadrant.hasStarbase
      ? false
      : Ship.offsets.some(offset => {
        let position = {
          row: this.sector.row + offset.row,
          column: this.sector.column + offset.column
        };
        if (position.row < 1 || position.row > Sector.rows
          || position.column < 1 || position.column > Sector.columns) return false;
        return this.quadrant.sectors[position.row - 1][position.column - 1].containsStarbase;
      });
  }
}

export class Klingon implements Entity {

}

export class Starbase implements Entity {

}

export class Star implements Entity {

}
