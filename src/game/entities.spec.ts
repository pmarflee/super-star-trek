import { spy, assert } from 'sinon';
import { expect } from 'chai';
import Prando from 'prando';
import * as Entities from './entities';
import Quadrant from './quadrant';
import Sector from './sector';
import { quadrantState } from './quadrant.testdata';

describe('Ship', () => {
  let rng = new Prando(1),
    quadrants = Quadrant.createQuadrants(quadrantState, rng),
    quadrant = quadrants[3][4],
    ship = new Entities.Ship();

  describe('Set position', () => {
    ship.setPosition(quadrant, { row: 3, column: 4 });

    it('should be positioned in correct quadrant', () => {
      expect(ship.quadrant).to.equal(quadrant);
    });

    it('should be positioned in correct sector', () => {
      let sector = quadrant.sectors[3][4];

      expect(ship.sector).to.equal(sector);
      expect(sector.entity).to.equal(ship);
    });
  });
})
