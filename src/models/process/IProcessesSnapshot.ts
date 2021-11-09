import { ISnapshotApplicationProcess } from "./ISnapshotApplicationProcess";

export interface IProcessesSnapshot {
    hasActiveSession: boolean;
    processes: ISnapshotApplicationProcess[];
}
