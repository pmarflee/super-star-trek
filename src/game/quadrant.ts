import Sector from './sector';

export default class Quadrant {

  public static readonly columns: number = 8;
  public static readonly rows: number = 8;

  public klingons: number = 0;
  public hasStarbase: boolean = false;
  public readonly sectors: Sector[];

  constructor(public readonly stars: number) {

    this.sectors = Array.from(new Array(Sector.rows), (row, rowIndex) => 
      Array.from(new Array(Sector.columns), (col, colIndex) => new Sector()));
  }
}
