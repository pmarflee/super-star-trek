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
      expect(ship.isDocked).to.be.false;
    });

    it('Should not be docked when in a quadrant with a starbase and not adjacent to it', () => {
      quadrant.sectors[2][0].entity = new Entities.Starbase();
      expect(ship.isDocked).to.be.false;
    });

    it('Should be docked when in a quadrant with a starbase and adjacent to it', () => {
      quadrant.hasStarbase = true;
      quadrant.sectors[1][0].entity = new Entities.Starbase();
      expect(ship.isDocked).to.be.true;
    });
  });

  describe('Navigate', () => {
    let game: Game,
      ship: Entities.Ship;

    beforeEach(() => {
      game = Game.fromRandom(new Prando(1));
      ship = game.ship;
    });

    it('Should throw error if direction is less than minimum allowed', () => {
      expect(() => ship.navigate(0, 1, null, null)).to.throw('Invalid course');
    });

    it('Should throw error if direction is greater than maximum allowed', () => {
      expect(() => ship.navigate(9, 1, null, null)).to.throw('Invalid course');
    });

    it('Should throw error if warp factor is less than minimum allowed', () => {
      expect(() => ship.navigate(3, 0, null, null)).to.throw('Invalid warp factor');
    });

    it('Should throw error if warp factor is greater than maximum allowed', () => {
      expect(() => ship.navigate(3, 9, null, null)).to.throw('Invalid warp factor');
    });

    it('Should throw error if warp engines are damaged and warp factor exceeds maximum allowed', () => {
      ship.navigationDamage = 1;

      expect(() => ship.navigate(3, 8, null, new Rng.TestRandomNumberGenerator(8)))
        .to.throw('Invalid warp factor');
    });

    it('Should throw error if insufficient energy to navigate', () => {
      ship.energy = 0;

      expect(() => ship.navigate(3, 8, null, new Rng.TestRandomNumberGenerator(8)))
        .to.throw('Insufficient energy');
    });

    it('Should reduce energy', () => {
      let originalEnergy = ship.energy;
      try {
        ship.navigate(3, 8, game, new Rng.TestRandomNumberGenerator(8));
      } catch (err) {}
      expect(ship.energy).to.equal(originalEnergy - 64);
    });

    it('Should throw error when navigating within the same quadrant and an obstacle is encountered', () => {
      expect(() => ship.navigate(1, 0.375, game))
        .to.throw('Obstacle encountered');
    });

    it('Should not throw error when navigating within the same quadrant and an obstacle is not encountered', () => {
      expect(() => ship.navigate(1, 0.25, game))
        .to.not.throw('Obstacle encountered');
    });

    it('Should not change quadrant when navigating within the same quadrant', () => {
      let quadrant = ship.quadrant;

      ship.navigate(1, 0.25, game);

      expect(ship.quadrant).to.equal(quadrant);
    });

    it('Should move ship to correct sector when navigating within the same quadrant', () => {
      let sectorRow = ship.sector.row,
        sectorColumn = ship.sector.column;

      ship.navigate(1, 0.25, game);

      expect(ship.sector.row).to.equal(sectorRow);
      expect(ship.sector.column).to.equal(sectorColumn + 2);
    });

    it('Should change quadrant when navigating to another quadrant', () => {
      let quadrant = ship.quadrant;

      ship.navigate(3, 1, game);

      expect(ship.quadrant.row).to.equal(quadrant.row - 1);
      expect(ship.quadrant.column).to.equal(quadrant.column);
    });

    it('Should not change sector when navigating to another quadrant', () => {
      let sector = ship.sector;

      ship.navigate(3, 1, game);

      expect(ship.sector.row).to.equal(sector.row);
      expect(ship.sector.column).to.equal(sector.column);
    });

    it('Should advance stardate if navigation is successful', () => {
      let stardate = game.stardate;

      ship.navigate(3, 1, game);

      expect(game.stardate).to.equal(stardate + 1);
    });

    it('Should decrease time remaining if navigation is successful', () => {
      let timeRemaining = game.timeRemaining;

      ship.navigate(3, 1, game);

      expect(game.timeRemaining).to.equal(timeRemaining - 1);
    });
  });
});
