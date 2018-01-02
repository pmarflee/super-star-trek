import { spy, assert } from 'sinon';
import { expect } from 'chai';
import Prando from 'prando';
import { Game, LongRangeSensorScanResult } from './game';
import { Ship } from './entities';
import Quadrant from './quadrant';
import { quadrantState } from './quadrant.testdata';

describe('Create Game from seed', () => {
  let game = Game.fromRandom(new Prando(1));

  it('should have intial number of klingons between 5 and 20', () => {
    expect(game.initialKlingons).to.be.within(5, 20);
  });

  it('should have initial number of starbases between 2 and 4', () => {
    expect(game.initialStarbases).to.be.within(2, 4);
  });

  it('should have stardate between 2250 and 2300', () => {
    expect(game.stardate).to.be.within(2250, 2300);
  });

  it('should have time remaining between 40 and 49', () => {
    expect(game.initialTimeRemaining).to.be.within(40, 49);
  });

  describe('Quadrant map', () => {
    it('should be the correct size', () => {
      expect(game.quadrants.length).to.equal(Quadrant.rows);
      game.quadrants.every(quadrant => expect(quadrant.length).to.equal(Quadrant.columns));
    });

    it('should contain klingons equal to the initial number for the game', () => {
      expect(game.klingons).to.equal(game.initialKlingons);
    });

    it('should contain starbases equal to the initial number for the game', () => {
      expect(game.starbases).to.equal(game.initialStarbases);
    });

    it('should contain between 1 and MAX_STARS stars in each quadrant', () => {
      game.quadrants.every(row =>
        row.every(quadrant => expect(quadrant.stars).to.be.within(1, Game.max_stars)));
    });
  });

  describe('Ship', () => {
    let ship = game.ship;

    it('should have a quadrant row location between 0 and 7', () => {
      expect(ship.quadrant.row).to.be.within(0, 7);
    });

    it('should have a quadrant column location between 0 and 7', () => {
      expect(ship.quadrant.column).to.be.within(0, 7);
    });

    it('should have energy equal to 3000', () => {
      expect(ship.energy).to.equal(3000);
    });

    it('should have 10 photon torpedoes', () => {
      expect(ship.photonTorpedoes).to.equal(10);
    });

    it('should have shields equal to 0', () => {
      expect(ship.shields).to.equal(0);
    });
  });

});

describe('Long range sensor scan', () => {
  let rng = new Prando(1),
    quadrants = Quadrant.createQuadrants(quadrantState),
    quadrant = quadrants[4][3],
    ship = new Ship(quadrant, { row: 0, column: 6 }, rng),
    game = new Game({
      rng: rng,
      klingons: 4,
      starbases: 0,
      quadrants: quadrants,
      ship: ship,
      stardate: 2250,
      timeRemaining: 40
    }),
    scan = game.longRangeSensorScan;

  it('should return an 8x8 array', () => {
    expect(scan.length).to.equal(8);
    scan.every(row => expect(row.length).to.equal(8));
  });

  it('should report correct location of ship', () => {
    let shipQuadrant = game.ship.quadrant;
    expect(scan[shipQuadrant.row][shipQuadrant.column].ship).to.be.true;
  });

  it('should report correct number of klingons for each quadrant', () => {
    for (let row = 0; row < Quadrant.rows; row++) {
      for (let col = 0; col < Quadrant.columns; col++) {
        expect(scan[row][col].klingons).to.equal(game.quadrants[row][col].klingons);
      }
    }
  });

  it('should report correct number of starbases for each quadrant', () => {
    for (let row = 0; row < Quadrant.rows; row++) {
      for (let col = 0; col < Quadrant.columns; col++) {
        expect(scan[row][col].starbases).to.equal(game.quadrants[row][col].hasStarbase ? 1 : 0);
      }
    }
  });

  it('should report correct number of stars for each quadrant', () => {
    for (let row = 0; row < Quadrant.rows; row++) {
      for (let col = 0; col < Quadrant.columns; col++) {
        expect(scan[row][col].stars).to.equal(game.quadrants[row][col].stars);
      }
    }
  });
});
