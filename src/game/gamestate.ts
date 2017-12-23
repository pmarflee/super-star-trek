import Quadrant from './quadrant';
import Ship from './ship';

export default interface GameState {
  seed?: number;
  klingons?: number;
  starbases?: number;
  quadrants?: Quadrant[][];
  ship?: Ship;
  stardate?: number;
  timeRemaining?: number;
}
