import Game from './game';
import Quadrant from './quadrant';
import Sector from './sector';
import { Position } from './game';

export interface Entity {

}

export class Ship implements Entity {
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

  public setPosition(quadrant: Quadrant, position: Position): void {
    this.quadrant = quadrant;

    quadrant.createSectors();
    quadrant.positionEntities(this, position);
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
