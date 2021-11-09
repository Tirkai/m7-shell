import { IVirtualViewportState } from "./IVirtualViewportState";

export class ViewportDefaultState implements IVirtualViewportState {
    closable: boolean = true;
    controlable: boolean = true;
    savable: boolean = true;
    displayable: boolean = true;
}
