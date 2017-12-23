import Quadrant from './quadrant';

export default interface GameState {

  klingons: number;
  starbases: number;
  quadrants: Quadrant[][];
}
