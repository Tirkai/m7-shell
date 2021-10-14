interface INavigationRefererOptions {
    refererName: string;
    refererProcessId: string;
    refererWindowId: string;
    currentProcessId: string;
}

export class NavigationReferer {
    refererName: string;
    refererProcessId: string;
    refererWindowId: string;
    currentProcessId: string;
    constructor(options: INavigationRefererOptions) {
        this.refererName = options.refererName;
        this.refererProcessId = options.refererProcessId;
        this.refererWindowId = options.refererWindowId;
        this.currentProcessId = options.currentProcessId;
    }
}
