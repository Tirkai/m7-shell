import { IApplicationProcessState } from "./IApplicationProcessState";

export class ApplicationProcessStandState implements IApplicationProcessState {
    closable: boolean = false;
    killable: boolean = true;
    savable: boolean = false;
}
