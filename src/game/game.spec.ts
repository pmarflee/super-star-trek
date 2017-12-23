import { spy, assert } from 'sinon';
import { expect } from 'chai';
import Game from './game';
import Quadrant from './quadrant';

describe('Create Game from seed', () => {

  var game = new Game({ seed: 1 });

  it('should have number of klingons between 5 and 20', () => {
    expect(game.klingons).to.be.within(5, 20);
  });

  it('should have number of starbases between 2 and 4', () => {
    expect(game.starbases).to.be.within(2, 4);
  });

  it('should have stardate between 2250 and 2300', () => {
    expect(game.stardate).to.be.within(2250, 2300);
  })

  it('should have time remaining between 40 and 49', () => {
    expect(game.timeRemaining).to.be.within(40, 49);
  });

  describe('Quadrant map', () => {
    it('should be the correct size', () => {
      expect(game.quadrants.length).to.equal(Quadrant.rows);
      game.quadrants.every(quadrant => expect(quadrant.length).to.equal(Quadrant.columns));
    });

    it('should contain klingons equal to the number in the game', () => {
      var klingons = game.quadrants.reduce((acc, quadrant) =>
        acc + quadrant.reduce((acc1, sector) => acc1 + sector.klingons, 0), 0);
      expect(klingons).to.equal(game.klingons);
    });

    it('should contain starbases equal to the number in the game', () => {
      var starbases = game.quadrants.reduce((acc, quadrant) =>
        acc + quadrant.reduce((acc1, sector) => acc1 + (sector.hasStarbase ? 1 : 0), 0), 0);
      expect(starbases).to.equal(game.starbases);
    });

    it('should contain between 1 and MAX_STARS stars in each quadrant', () => {
      game.quadrants.every(row =>
        row.every(quadrant => expect(quadrant.stars).to.be.within(1, Game.max_stars)));
    })
  });

  describe('Ship', () => {
    var ship = game.ship;

    it('should have a quadrant row location between 0 and 7', () => {
      expect(ship.quadrant.row).to.be.within(0, 7);
    });

    it('should have a quadrant column location between 0 and 7', () => {
      expect(ship.quadrant.column).to.be.within(0, 7);
    });

    it('should have energy equal to 3000', () => {
      expect(ship.energy).to.equal(3000);
    })

    it('should have 10 photon torpedoes', () => {
      expect(ship.photonTorpedoes).to.equal(10);
    })

    it('should have shields equal to 0', () => {
      expect(ship.shields).to.equal(0);
    })
  })

});
