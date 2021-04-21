import { IApplicationWindowOptions } from "interfaces/window/IApplicationWindowOptions";
import { ApplicationWindow } from "models/ApplicationWindow";
import { IWindowFactory } from "./IWindowFactory";

export class FloatWindowFactory implements IWindowFactory {
    create(options: IApplicationWindowOptions) {
        return new ApplicationWindow(options);
    }
}
