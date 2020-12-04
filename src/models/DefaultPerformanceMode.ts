import { IPerformanceMode } from "interfaces/performance/IPerformanceMode";

export class DefaultPerformanceMode implements IPerformanceMode {
    enableAnimation: boolean = true;
    enableBackdrop: boolean = false;
}
