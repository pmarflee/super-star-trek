import { spy, assert } from 'sinon';
import { expect } from 'chai';
import Prando from 'prando';
import * as Entities from './entities';
import Quadrant from './quadrant';
import Sector from './sector';
import { quadrantState } from './quadrant.testdata';

describe('Ship', () => {
  let rng: Prando,
    quadrants: Quadrant[][],
    ship: Entities.Ship;

  beforeEach(() => {
    rng = new Prando(1);
    quadrants = Quadrant.createQuadrants(quadrantState, rng);
    ship = new Entities.Ship();
  });

  describe('Set position', () => {
    let quadrant: Quadrant;

    beforeEach(() => {
      quadrant = quadrants[3][4];
      ship.setPosition(quadrant, { row: 3, column: 4 });
    });

    it('should be positioned in correct quadrant', () => {
      expect(ship.quadrant).to.equal(quadrant);
    });

    it('should be positioned in correct sector', () => {
      let sector = quadrant.sectors[3][4];

      expect(ship.sector).to.equal(sector);
      expect(sector.entity).to.equal(ship);
    });
  });

  describe('Docking', () => {
    let quadrant: Quadrant;

    beforeEach(() => {
      quadrant = quadrants[0][0];
      quadrant.createSectors();
      ship.quadrant = quadrant;
      ship.setSector(quadrant.sectors[0][0]);
    });

    it('Should not be docked when in a quadrant with no starbase', () => {
      expect(ship.isDocked).to.equal(false);
    });

    it('Should not be docked when in a quadrant with a starbase and not adjacent to it', () => {
      quadrant.sectors[2][0].entity = new Entities.Starbase();
      expect(ship.isDocked).to.equal(false);
    });

    it('Should be docked when in a quadrant with a starbase and adjacent to it', () => {
      quadrant.hasStarbase = true;
      quadrant.sectors[1][0].entity = new Entities.Starbase();
      expect(ship.isDocked).to.equal(true);
    });
  });
});
