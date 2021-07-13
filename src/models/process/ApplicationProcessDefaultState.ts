import { IApplicationProcessState } from "./IApplicationProcessState";

export class ApplicationProcessDefaultState
    implements IApplicationProcessState {
    closable: boolean = true;
    killable: boolean = true;
    savable: boolean = true;
}
