import { IApplicationWindowOptions } from "interfaces/window/IApplicationWindowOptions";
import { ApplicationWindow } from "models/ApplicationWindow";

export interface IWindowFactory {
    create: <T = any>(
        options: IApplicationWindowOptions,
        params?: T,
    ) => ApplicationWindow;
}
