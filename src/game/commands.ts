import { Game } from './game';

export interface Command {
  execute(game: Game): void;
}

export class NavigateCommand implements Command {
  constructor(public readonly direction: number, public readonly distance: number) {

  }

  execute(game: Game): void {
    game.moveShip(this.direction, this.distance);
  }
}

export class AdjustShieldsCommand implements Command {
  constructor(public readonly amount: number) {

  }

  execute(game: Game) {
    game.adjustShields(this.amount);
  }
}