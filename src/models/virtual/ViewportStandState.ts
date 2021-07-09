import { IVirtualViewportState } from "./IVirtualViewportState";

export class ViewportStandState implements IVirtualViewportState {
    closable: boolean = false;
    controlable: boolean = false;
    savable: boolean = false;
    displayable: boolean = false;
}
