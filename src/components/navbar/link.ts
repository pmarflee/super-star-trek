export class Link {
    name: string;
    path: string;
    target: string;

    constructor(name: string, path: string, target?: string) {
        this.name = name;
        this.path = path;
        this.target = target;
    }
}
