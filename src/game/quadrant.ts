import { RandomNumberGenerator } from './rng';
import { Game } from '../game/game';
import Sector from './sector';
import * as Entities from './entities';
import { Position } from './game';

export default class Quadrant {

  public static readonly columns: number = 8;
  public static readonly rows: number = 8;

  public sectors: Sector[][];
  public klingons: Entities.Klingon[] = [];
  public scanned: boolean = false;

  constructor(
    public readonly row: number,
    public readonly column: number,
    public readonly stars: number,
    public numberOfKlingons: number = 0,
    public hasStarbase: boolean = false) {
  }

  public createSectors(): void {
    this.sectors = Array.from(new Array(Sector.rows), (row, rowIndex) => 
      Array.from(new Array(Sector.columns), (col, colIndex) =>
        new Sector(rowIndex, colIndex)));
  }

  public positionEntities(
    ship: Entities.Ship,
    shipPosition: Position,
    rng: RandomNumberGenerator): void {
    let klingons = 0,
      hasStarbase = false,
      stars = 0,
      shipSector = this.sectors[shipPosition.row][shipPosition.column];

    ship.setSector(shipSector);

    while (klingons < this.numberOfKlingons) {
      let sector = this.getRandomSector(rng);
      if (!sector.entity) {
        let klingon = new Entities.Klingon(sector, 300 + rng.nextInt(0, 200));
        sector.entity = klingon;
        this.klingons.push(klingon);
        klingons++;
      }
    } 

    while (this.hasStarbase && !hasStarbase) {
      let sector = this.getRandomSector(rng);
      if (!sector.entity) {
        sector.entity = new Entities.Starbase(sector);
        hasStarbase = true;
      }
    }

    while (stars < this.stars) {
      let sector = this.getRandomSector(rng);
      if (!sector.entity) {
        sector.entity = new Entities.Star(sector);
        stars++;
      }
    }
  }

  public getRandomPosition(rng: RandomNumberGenerator): Position {
    let row = rng.nextInt(0, Sector.rows - 1),
      column = rng.nextInt(0, Sector.columns - 1);

    return { row: row, column: column };
  }

  public getRandomSector(rng: RandomNumberGenerator): Sector {
    let row = rng.nextInt(0, Sector.rows - 1),
      column = rng.nextInt(0, Sector.columns - 1);

    return this.sectors[row][column];
  }

  public static createQuadrants(state: [number, number, boolean][][]): Quadrant[][] {
    return Array.from(state, (row, rowIndex) =>
      Array.from(row, (quadState, colIndex) =>
        new Quadrant(
          rowIndex,
          colIndex,
          quadState[1],
          quadState[0],
          quadState[2]))); 
  }
}
