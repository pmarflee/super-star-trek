import * as Entities from './entities';

export default class Sector {

  public static readonly columns: number = 8;
  public static readonly rows: number = 8;

  public entity: Entities.Entity;

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
}
