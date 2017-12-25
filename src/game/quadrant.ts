import Prando from 'prando';
import Sector from './sector';

export default class Quadrant {

  public static readonly columns: number = 8;
  public static readonly rows: number = 8;

  public sectors: Sector[];

  constructor(
    public readonly row: number,
    public readonly column: number,
    public readonly stars: number,
    public klingons: number = 0,
    public hasStarbase: boolean = false) {
  }

  public createSectors(): void {
    this.sectors = Array.from(new Array(Sector.rows), (row, rowIndex) => 
      Array.from(new Array(Sector.columns), (col, colIndex) => new Sector()));
  }

  public getRandomSector(rng: Prando): Sector {
    let row = rng.nextInt(0, Sector.rows - 1),
      column = rng.nextInt(0, Sector.columns - 1);

    return this.sectors[row][column];
  }

  public static createQuadrants(state: [number, number, boolean][][]): Quadrant[][] {
    return Array.from(state, (row, rowIndex) =>
      Array.from(row, (quadState, colIndex) =>
        new Quadrant(
          rowIndex + 1,
          colIndex + 1,
          quadState[1],
          quadState[0],
          quadState[2]))); 
  }
}
