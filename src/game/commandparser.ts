import * as Commands from './commands';

export default class CommandParser {
  private readonly parsers: [RegExp, (match: RegExpExecArray) => Commands.Command][] = [
    [ /^nav\s+(\d+(\.\d{1,3})?)\s+(\d+(\.\d{1,3})?)$/i,
      (match: RegExpExecArray) => new Commands.NavigateCommand(
        parseFloat(match[1]),
        parseFloat(match[3]))],
    [/^she\s+add\s+(\d+)$/i,
      (match: RegExpExecArray) => new Commands.AdjustShieldsCommand(parseInt(match[1]))],
    [/^she\s+sub\s+(\d+)$/i,
      (match: RegExpExecArray) => new Commands.AdjustShieldsCommand(-parseInt(match[1]))],
    [/^pha\s+(\d+)$/i,
      (match: RegExpExecArray) => new Commands.FirePhasersCommand(parseInt(match[1]))],
    [/^pho\s+(\d+(\.\d{1,3})?)\s+(\d+(\.\d{1,3})?)$/i,
      (match: RegExpExecArray) => new Commands.FirePhotonTorpedoesCommand(
        parseFloat(match[1]),
        parseFloat(match[3]))],
  ];

  public parse(input: string): Commands.Command {
    for (let parser of this.parsers) {
      let match = parser[0].exec(input);
      if (match) {
        return parser[1](match);
      }
    }
    throw new Error('Unable to parse command');
  }
}
