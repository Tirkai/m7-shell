export interface IApplicationOptions {
    id: string;
    name: string;
    key?: string;
    icon?: string;
    baseWidth?: number;
    baseHeight?: number;
    isVisibleInStartMenu?: boolean;
    minWidth?: number;
    minHeight?: number;
    isFullscreen?: boolean;
}
