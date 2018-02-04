import { Game } from './game';

export abstract class Command {
  execute(game: Game): void {
    try {
      this.doAction(game);
      let successMessage = this.getSuccessMessage(game);
      if (successMessage) {
        game.raiseSimpleEvent(successMessage);
      }
    } catch (e) {
      game.raiseSimpleEvent(`ERROR: ${e.message}`);
    }
  }

  protected abstract doAction(game: Game): void;

  protected getSuccessMessage(game: Game): string {
    return null;
  }
}

export class NavigateCommand extends Command {
  constructor(public readonly direction: number, public readonly distance: number) {
    super();
  }

  doAction(game: Game): void {
    game.moveShip(this.direction, this.distance);
  }

  getSuccessMessage(game: Game): string {
    return game.ship.isDestroyed ? null : 'Warp engines engaged';
  }
}

export class AdjustShieldsCommand extends Command {
  constructor(public readonly amount: number) {
    super();
  }

  doAction(game: Game) {
    game.adjustShields(this.amount);
  }
  getSuccessMessage(game: Game): string {
    return `Shields ${this.amount > 0 ? 'increased' : 'decreased'} by ${Math.abs(this.amount)} to ${game.shields}`;
  }
}

export class FirePhasersCommand extends Command {
  constructor(public readonly energy: number) {
    super();
  }

  doAction(game: Game) {
    game.firePhasers(this.energy);
  }
}
