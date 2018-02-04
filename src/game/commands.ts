import { Game } from './game';

export abstract class Command {
  execute(game: Game): void {
    try {
      this.doAction(game);
    } catch (e) {
      game.raiseSimpleEvent(`ERROR: ${e.message}`);
    }
  }

  protected abstract doAction(game: Game): void;
}

export class NavigateCommand extends Command {
  constructor(public readonly direction: number, public readonly distance: number) {
    super();
  }

  doAction(game: Game): void {
    game.moveShip(this.direction, this.distance);
  }
}

export class AdjustShieldsCommand extends Command {
  constructor(public readonly amount: number) {
    super();
  }

  doAction(game: Game) {
    game.adjustShields(this.amount);
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

export class FirePhotonTorpedoesCommand extends Command {
  constructor(public readonly direction: number) {
    super();
  }

  doAction(game: Game): void {
    game.firePhotonTorpedoes(this.direction);
  }
}
