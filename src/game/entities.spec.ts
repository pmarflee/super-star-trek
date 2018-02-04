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
      let sector = quadrant.sectors[2][0];
      sector.entity = new Entities.Starbase(sector);
      expect(ship.isDocked).to.be.false;
    });

    it('Should be docked when in a quadrant with a starbase and adjacent to it', () => {
      quadrant.hasStarbase = true;
      let sector = quadrant.sectors[1][0];
      sector.entity = new Entities.Starbase(sector);
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

    it('Should replenish supplies if ship docks with starbase', () => {
      let sector = ship.quadrant.sectors[2][3];

      ship.energy = 1000;
      ship.photonTorpedoes = 0;
      ship.navigationDamage = 100;
      ship.shortRangeScanDamage = 100;
      ship.longRangeScanDamage = 100;
      ship.shieldControlDamage = 100;
      ship.computerDamage = 100;
      ship.photonDamage = 100;
      ship.phaserDamage = 100;
      ship.shields = 1000;

      ship.quadrant.hasStarbase = true;
      sector.entity = new Entities.Starbase(sector);
      ship.navigate(1, 0.125, game);

      expect(ship.isDocked).to.equal(true);
      expect(ship.energy).to.equal(3000);
      expect(ship.photonTorpedoes).to.equal(10);
      expect(ship.shortRangeScanDamage).to.equal(0);
      expect(ship.longRangeScanDamage).to.equal(0);
      expect(ship.shieldControlDamage).to.equal(0);
      expect(ship.computerDamage).to.equal(0);
      expect(ship.photonDamage).to.equal(0);
      expect(ship.phaserDamage).to.equal(0);
      expect(ship.shields).to.equal(0);
    });
  });

  describe('Adjust Shields', () => {
    let game: Game,
      ship: Entities.Ship;

    beforeEach(() => {
      game = Game.fromRandom(new Prando(1));
      ship = game.ship;
    });

    it('Should transfer energy to shields if energy is available', () => {
      let initialEnergy = ship.energy;

      ship.adjustShields(100);

      expect(ship.shields).to.equal(100);
      expect(ship.energy).to.equal(initialEnergy - ship.shields);
    });

    it('Should transfer energy from shields if shield energy is available', () => {
      ship.shields = 100;
      ship.energy = 2900;

      let initialEnergy = ship.energy,
        initialShields = ship.shields;

      ship.adjustShields(-100);

      expect(ship.shields).to.equal(0);
      expect(ship.energy).to.equal(initialEnergy + 100);
    });

    it('Should round adjustment amount down to nearest whole number', () => {
      ship.adjustShields(100.5);

      expect(ship.shields).to.equal(100);
    });

    it('Should throw error if insufficient energy available to transfer to shields', () => {
      expect(() => ship.adjustShields(3100)).to.throw('Invalid amount of energy');
    });

    it('Should throw error if an attempt is made to reduce shield strength below zero', () => {
      expect(() => ship.adjustShields(-100)).to.throw('Invalid amount of energy');
    });
  });
});

describe('Fire phasers', () => {
  
  describe('Klingons in quadrant', () => {
    let rng: Prando,
      game: Game,
      ship: Entities.Ship;

    beforeEach(() => {
      rng = new Prando('1748');
      game = Game.fromRandom(rng);
      ship = game.ship;
    });

    it('should throw error if ship has sustained phaser damage', () => {
      ship.phaserDamage = 50;
      expect(() => ship.firePhasers(100, game)).to.throw('Phasers are damaged. Repairs are underway.');
    });

    it('should reduce ship energy when firing phasers', () => {
      let initialEnergy = ship.energy,
        phaserEnergy = 100;
      ship.firePhasers(phaserEnergy, game);
      expect(ship.energy).to.equal(initialEnergy - phaserEnergy);
    });

    it('should inflict damage on Klingon ships', () => {
      let klingon = ship.quadrant.klingons[0],
        initialKlingonShields = klingon.shields;
      ship.firePhasers(100, game);
      expect(klingon.shields).to.be.below(initialKlingonShields);
    });

    it('should destroy klingon ship if its shields are less than or equal to zero', () => {
      let klingon = ship.quadrant.klingons[0];
      klingon.shields = 0;
      ship.firePhasers(100, game);
      expect(ship.quadrant.numberOfKlingons).to.equal(0);
      expect(ship.quadrant.klingons).to.be.empty;
    });

    it('should report ship as destroyed if its shield strength is less than zero', () => {
      ship.firePhasers(100, game);
      expect(ship.isDestroyed).to.be.true;
    });

    it('should not report ship as destroyed if its shield strength is not less than zero', () => {
      ship.shields = 500;
      ship.firePhasers(100, game);
      expect(ship.isDestroyed).to.be.false;
    });
  });

  describe('No Klingons in quadrant', () => {
    let rng = new Prando(1),
      game = Game.fromRandom(rng);

    it('should throw error', () => {
      expect(() => game.ship.firePhasers(100, game)).to.throw('There are no Klingon ships in this quadrant.');
    });
  });
});

describe('Fire Photon Torpedoes', () => {

  describe('Klingons in quadrant', () => {
    let rng: Prando,
      game: Game,
      ship: Entities.Ship;

    beforeEach(() => {
      rng = new Prando('1748');
      game = Game.fromRandom(rng);
      ship = game.ship;
    });

    it('should throw error if photon torpedoes exhausted', () => {
      ship.photonTorpedoes = 0;
      expect(() => ship.firePhotonTorpedoes(1, 1, game)).to.throw('Photon torpedoes exhausted.');
    });
  });

  describe('No Klingons in quadrant', () => {
    let rng = new Prando(1),
      game = Game.fromRandom(rng);

    it('should throw error', () => {
      expect(() => game.ship.firePhotonTorpedoes(1, 1, game))
        .to.throw('There are no Klingon ships in this quadrant.');
    });
  });
});
