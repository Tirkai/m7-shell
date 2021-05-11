import { IApplicationProcess } from "./IApplicationProcess";

export interface IProcessesSnapshot {
    hasActiveSession: boolean;
    processes: IApplicationProcess[];
}
