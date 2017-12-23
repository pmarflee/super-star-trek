import { spy, assert } from 'sinon';
import { expect } from 'chai';
import Game from './game';
import Quadrant from './quadrant';

describe('Create Game', () => {

  var game = Game.create(1);

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
  });

});
