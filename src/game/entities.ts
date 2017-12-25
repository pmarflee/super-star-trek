import Game from './game';
import Quadrant from './quadrant';
import Sector from './sector';
import { Position } from './game';

export interface Entity {

}

export class Ship implements Entity {
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
}

export class Klingon implements Entity {

}

export class Starbase implements Entity {

}

export class Star implements Entity {

}
