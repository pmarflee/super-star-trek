import Prando from 'prando';

export interface RandomNumberGenerator {
  nextInt(min?: number, max?: number): number;
}
