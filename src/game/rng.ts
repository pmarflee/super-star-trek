import Prando from 'prando';

export interface RandomNumberGenerator {
  nextInt(min?: number, max?: number): number;
}

export class TestRandomNumberGenerator implements RandomNumberGenerator {
  private readonly numbers: number[];
  private position = 0;

  constructor(...params: number[]) {
    this.numbers = params;
  }

  nextInt(min?: number, max?: number): number {
    return this.numbers[this.position++];
  }
}
