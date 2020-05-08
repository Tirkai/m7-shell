import { IShellApplicationOptions } from "interfaces/options/IShellApplicationOptions";
import { Application } from "./Application";

export class ShellApplication extends Application {
    Component: JSX.Element;

    constructor(options: IShellApplicationOptions) {
        super(options);
        this.Component = options.Component;
    }
}
