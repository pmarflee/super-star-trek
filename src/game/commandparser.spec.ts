import { spy, assert } from 'sinon';
import { expect } from 'chai';
import * as Commands from './commands';
import CommandParser from './commandparser';

describe('Command parser', () => {
  let parser = new CommandParser();

  describe('Navigation', () => {

    describe('Valid input', () => {
      let testCases: [string, number, number][] = [
        ['nav 3 1', 3, 1],
        ['nav 1.5 1', 1.5, 1],
        ['nav 1 1.25', 1, 1.25],
        ['nav 7 0.125', 7, 0.125],
        ['nav 7.125 1', 7.125, 1],
        ['Nav 3 1', 3, 1]
      ];
      testCases.forEach(testCase => {
        it('Should parse valid input', () => {
          let result = parser.parse(testCase[0]);

          expect(result).is.instanceOf(Commands.NavigateCommand);
          expect(result, `input=${testCase[0]}`).to.have.property('direction', testCase[1]);
          expect(result, `input=${testCase[0]}`).to.have.property('distance', testCase[2]);
        });
      });
    });

    it('Should throw error for invalid input', () => {
      expect(() => parser.parse('nav x 1')).to.throw('Unable to parse command');
    });
  });

  describe('Shields', () => {

    it('Should parse valid input', () => {
      let testCases: [string, number][] = [
        ['she add 100', 100],
        ['She aDD 100', 100],
        ['she sub 100', -100],
        ['She sUB 100', -100]
      ];

      testCases.forEach(testCase => {
        let result = parser.parse(testCase[0]);

        expect(result).is.instanceOf(Commands.AdjustShieldsCommand);
        expect(result, `input=${testCase[0]}`).to.have.property('amount', testCase[1]);
      });
    });
  });

  describe('Phasers', () => {

    it('Should parse valid input', () => {
      let testCases: [string, number][] = [
        ['pha 100', 100],
        ['Pha 100', 100]
      ];

      testCases.forEach(testCase => {
        let result = parser.parse(testCase[0]);

        expect(result).is.instanceOf(Commands.FirePhasersCommand);
        expect(result, `input=${testCase[0]}`).to.have.property('energy', testCase[1]);
      });
    });

    it('Should throw error for invalid input', () => {
      expect(() => parser.parse('pha 125.5')).to.throw('Unable to parse command');
    });
  });

  describe('Photon torpedoes', () => {

    describe('Valid input', () => {
      let testCases: [string, number, number][] = [
        ['pho 3 1', 3, 1],
        ['pho 1.5 1', 1.5, 1],
        ['pho 1 1.25', 1, 1.25],
        ['pho 7 0.125', 7, 0.125],
        ['pho 7.125 1', 7.125, 1],
        ['Pho 3 1', 3, 1]
      ];
      testCases.forEach(testCase => {
        it('Should parse valid input', () => {
          let result = parser.parse(testCase[0]);

          expect(result).is.instanceOf(Commands.FirePhotonTorpedoesCommand);
          expect(result, `input=${testCase[0]}`).to.have.property('direction', testCase[1]);
          expect(result, `input=${testCase[0]}`).to.have.property('distance', testCase[2]);
        });
      });
    });

    it('Should throw error for invalid input', () => {
      expect(() => parser.parse('nav x 1')).to.throw('Unable to parse command');
    });
  });
});
