import { spy, assert } from 'sinon';
import { expect } from 'chai';
import * as Rng from './rng';
import Prando from 'prando';
import { Game } from './game';
import * as Entities from './entities';
import Quadrant from './quadrant';
import Sector from './sector';
import { quadrantState } from './quadrant.testdata';

describe('Ship', () => {
  let quadrants: Quadrant[][],
    ship: Entities.Ship,
    rng: Rng.RandomNumberGenerator;

  beforeEach(() => {
    rng = new Prando(1);
    quadrants = Quadrant.createQuadrants(quadrantState);
  });

  describe('Set position', () => {
    let quadrant: Quadrant;

    beforeEach(() => {
      quadrant = quadrants[3][4];
      ship = new Entities.Ship(quadrant, { row: 3, column: 4 }, rng);
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

  describe('Navigate', () => {
    let game: Game,
      ship: Entities.Ship;

    beforeEach(() => {
      game = Game.fromSeed(1, seed => new Prando(seed));
      ship = game.ship;
    });

    it('Should throw error if direction is less than minimum allowed', () => {
      expect(() => ship.navigate(0, 1, null)).to.throw('Invalid course');
    });

    it('Should throw error if direction is greater than maximum allowed', () => {
      expect(() => ship.navigate(9, 1, null)).to.throw('Invalid course');
    });

    it('Should throw error if warp factor is less than minimum allowed', () => {
      expect(() => ship.navigate(3, 0, null)).to.throw('Invalid warp factor');
    });

    it('Should throw error if warp factor is greater than maximum allowed', () => {
      expect(() => ship.navigate(3, 9, null)).to.throw('Invalid warp factor');
    });

    it('Should throw error if warp engines are damaged and warp factor exceeds maximum allowed', () => {
      ship.navigationDamage = 1;

      expect(() => ship.navigate(3, 8, new Rng.TestRandomNumberGenerator(8)))
        .to.throw('Invalid warp factor');
    });

    it('Should throw error if insufficient energy to navigate', () => {
      ship.energy = 0;

      expect(() => ship.navigate(3, 8, new Rng.TestRandomNumberGenerator(8)))
        .to.throw('Insufficient energy');
    });

    it('Should reduce energy if navigation is possible', () => {
      let originalEnergy = ship.energy;
      ship.navigate(3, 8, new Rng.TestRandomNumberGenerator(8));
      expect(ship.energy).to.equal(originalEnergy - 64);
    });
  });
});
