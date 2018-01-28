export interface RandomNumberGenerator {
  next(min?: number, max?: number): number;
  nextInt(min?: number, max?: number): number;
}

export class TestRandomNumberGenerator implements RandomNumberGenerator {
  private readonly numbers: number[];
  private position = 0;

  constructor(...params: number[]) {
    this.numbers = params;
  }

  next(min?: number, max?: number) {
    return this.numbers[this.position++];
  }
  
  nextInt(min?: number, max?: number): number {
    return this.numbers[this.position++];
  }
}
