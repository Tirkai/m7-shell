import { IApplicationOptions } from "interfaces/options/IApplicationOptions";

export class Application {
    name: string;

    isExecuted: boolean = false;

    constructor(options: IApplicationOptions) {
        this.name = options.name;
    }
}
