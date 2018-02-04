import * as Entities from './entities';

export abstract class GameEvent {
  public abstract get messages(): string[];
}

export class SimpleGameEvent extends GameEvent {
  private readonly _messages: string[];

  constructor(...messages: string[]) {
    super();
    this._messages = messages;
  }

  public get messages(): string[] {
    return this._messages;
  }
}

export class EnterpriseHitByKlingonEvent extends GameEvent {
  constructor(
    public readonly ship: Entities.Ship,
    public readonly klingon: Entities.Klingon) {
    super();
  }

  public get messages(): string[] {
    let enterpriseHitMessage = this.ship.isDocked
      ? `Enterprise hit by ship at sector ${this.klingon.sector.toString()}.  No damage due to starbase shields`
      : `Enterprise hit by ship at sector ${this.klingon.sector.toString()}.  Shields dropped to ${this.ship.shields}.`,
      msgs = [enterpriseHitMessage];

    if (this.ship.isDestroyed) {
      msgs.push('MISSION FAILED: ENTERPRISE DESTROYED!!!');
    }

    return msgs;
  }
}

export class KlingonHitByEnterpriseEvent extends GameEvent {
  constructor(public readonly klingon: Entities.Klingon) {
    super();
  }

  public get messages(): string[] {
    let message = this.klingon.shields <= 0
      ? `Klingon ship destroyed at sector ${this.klingon.sector.toString()}`
      : `Hit ship at sector ${this.klingon.sector.toString()}. Klingon shield strength dropped to ${this.klingon.shields}.`;
    
    return [message];
  }
}