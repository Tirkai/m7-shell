import { IPerformanceMode } from "interfaces/performance/IPerformanceMode";

export class PotatoPerformanceMode implements IPerformanceMode {
    enableAnimation: boolean = false;
    enableBackdrop: boolean = false;
}
