import Prando from 'prando';
import Sector from './sector';
import * as Entities from './entities';
import { Position } from './game';

export default class Quadrant {

  public static readonly columns: number = 8;
  public static readonly rows: number = 8;

  public sectors: Sector[][];

  constructor(
    private rng: Prando,
    public readonly row: number,
    public readonly column: number,
    public readonly stars: number,
    public klingons: number = 0,
    public hasStarbase: boolean = false) {
  }

  public createSectors(): void {
    this.sectors = Array.from(new Array(Sector.rows), (row, rowIndex) => 
      Array.from(new Array(Sector.columns), (col, colIndex) =>
        new Sector(rowIndex + 1, colIndex + 1)));
  }

  public positionEntities(ship: Entities.Ship, shipPosition: Position): void {
    let klingons = 0,
      hasStarbase = false,
      stars = 0,
      shipSector = this.sectors[shipPosition.row][shipPosition.column];

    ship.setSector(shipSector);

    while (klingons < this.klingons) {
      let sector = this.getRandomSector();
      if (!sector.entity) {
        sector.entity = new Entities.Klingon();
        klingons++;
      }
    } 

    while (this.hasStarbase && !hasStarbase) {
      let sector = this.getRandomSector();
      if (!sector.entity) {
        sector.entity = new Entities.Starbase();
        hasStarbase = true;
      }
    }

    while (stars < this.stars) {
      let sector = this.getRandomSector();
      if (!sector.entity) {
        sector.entity = new Entities.Star();
        stars++;
      }
    }
  }

  public getRandomPosition(): Position {
    let row = this.rng.nextInt(0, Sector.rows - 1),
      column = this.rng.nextInt(0, Sector.columns - 1);

    return { row: row, column: column };
  }

  public getRandomSector(): Sector {
    let row = this.rng.nextInt(0, Sector.rows - 1),
      column = this.rng.nextInt(0, Sector.columns - 1);

    return this.sectors[row][column];
  }

  public static createQuadrants(state: [number, number, boolean][][], rng: Prando): Quadrant[][] {
    return Array.from(state, (row, rowIndex) =>
      Array.from(row, (quadState, colIndex) =>
        new Quadrant(
          rng,
          rowIndex + 1,
          colIndex + 1,
          quadState[1],
          quadState[0],
          quadState[2]))); 
  }
}
