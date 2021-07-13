import { IProcessesSnapshot } from "models/process/IProcessesSnapshot";
import { IVirtualViewportSnapshot } from "models/virtual/IVirtualViewportsSnapshot";

export interface ISessionRecovery {
    processSnapshot: IProcessesSnapshot;
    viewportSnapshot: IVirtualViewportSnapshot;
}
