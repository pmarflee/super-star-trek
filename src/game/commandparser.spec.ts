import { spy, assert } from 'sinon';
import { expect } from 'chai';
import * as Commands from './commands';
import CommandParser from './commandparser';

describe('Navigation', () => {
  let parser = new CommandParser();

  describe('Valid input', () => {
    let testCases: [string, number, number][] = [
      ['nav 3 1', 3, 1],
      ['nav 1.5 1', 1.5, 1],
      ['nav 1 1.25', 1, 1.25],
      ['nav 7 0.125', 7, 0.125],
      ['nav 7.125 1', 7.125, 1]
    ];
    testCases.forEach(testCase => {
      it('Should parse valid input', () => {
        let result = parser.parse(testCase[0]);
        expect(result, `input=${testCase[0]}`).to.have.property('direction', testCase[1]);
        expect(result).to.have.property('distance', testCase[2]);
      });
    });
  });

  it('Should throw error for invalid input', () => {
    expect(() => parser.parse('nav x 1')).to.throw('Unable to parse command');
  });
});
