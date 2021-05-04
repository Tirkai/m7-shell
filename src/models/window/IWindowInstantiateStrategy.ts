import { IApplicationWindow } from "./IApplicationWindow";

export interface IWindowInstantiateStrategy {
    instantiate: () => IApplicationWindow;
}
