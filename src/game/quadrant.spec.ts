import { spy, assert } from 'sinon';
import { expect } from 'chai';
import Prando from 'prando';
import { Game, LongRangeSensorScanResult } from './game';
import * as Entities from './entities';
import Quadrant from './quadrant';
import Sector from './sector';
import { quadrantState } from './quadrant.testdata';

describe('Create sectors', () => {
  let rng = new Prando(1),
    quadrants = Quadrant.createQuadrants(quadrantState),
    quadrant = quadrants[3][4],
    ship = new Entities.Ship(quadrant, { row: 4, column: 3 }, rng),
    sectors = quadrant.sectors;

  it('should create a sector grid of the correct height', () => {
    expect(sectors.length).to.equal(Sector.rows);
  });

  it('should create a sector grid of the correct height', () => {
    sectors.every(row => expect(row.length).to.equal(Sector.columns));
  });

  it('should position all klingons within sector', () => {
    let klingons = sectors.reduce((acc, row) =>
      acc + row.reduce((acc1, sector) => {
        let isKlingon = sector.entity instanceof Entities.Klingon;
        return acc1 + (isKlingon ? 1 : 0);
      }, 0), 0);

    expect(klingons).to.equal(quadrant.numberOfKlingons);
  });

  it('should position all starbases within sector', () => {
    let starbases = sectors.reduce((acc, row) =>
      acc + row.reduce((acc1, sector) => {
        let isStarbase = sector.entity instanceof Entities.Starbase;
        return acc1 + (isStarbase ? 1 : 0);
      }, 0), 0);

    expect(starbases).to.equal(quadrant.hasStarbase ? 1 : 0);
  });

  it('should position all stars within sector', () => {
    let stars = sectors.reduce((acc, row) =>
      acc + row.reduce((acc1, sector) => {
        let isStar = sector.entity instanceof Entities.Star;
        return acc1 + (isStar ? 1 : 0);
      }, 0), 0);

    expect(stars).to.equal(quadrant.stars);
  });

  it('should position ship within sector', () => {
    let ships = sectors.reduce((acc, row) =>
      acc + row.reduce((acc1, sector) => {
        let isShip = sector.entity instanceof Entities.Ship;
        return acc1 + (isShip ? 1 : 0);
      }, 0), 0);

    expect(ships).to.equal(1);
  });
});
