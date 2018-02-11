import * as Entities from './entities';
import Quadrant from './quadrant';

export default class Sector {

  public static readonly columns: number = 8;
  public static readonly rows: number = 8;

  public entity: Entities.Entity;

  constructor(public readonly row: number, public readonly column: number) {

  }

  public get containsKlingon(): boolean {
    return this.entity instanceof Entities.Klingon;
  }

  public get containsShip(): boolean {
    return this.entity instanceof Entities.Ship;
  }

  public get containsStarbase(): boolean {
    return this.entity instanceof Entities.Starbase;
  }

  public get containsStar(): boolean {
    return this.entity instanceof Entities.Star;
  }

  public get containsObstacle(): boolean {
    return this.containsEntity && !this.containsShip;
  }

  public get containsEntity(): boolean {
    return this.entity != null;
  }

  public isAdjacentToStarbase(quadrant: Quadrant): boolean {
    if (!quadrant.hasStarbase) return false;

    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {
        let row = this.row + rowOffset,
          column = this.column + columnOffset;
        if (row >= 0 && row < Sector.rows && column >= 0 && column < Sector.columns
          && quadrant.sectors[row][column].containsStarbase) return true;
      }
    }

    return false;
  }

  public toString(): string {
    return `[${this.column + 1}, ${this.row + 1}]`;
  }
}
