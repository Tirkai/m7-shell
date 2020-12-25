import { IPerformanceMode } from "interfaces/performance/IPerformanceMode";

export class BeautifulPerformanceMode implements IPerformanceMode {
    enableAnimation: boolean = true;
    enableBackdrop: boolean = false;
}
