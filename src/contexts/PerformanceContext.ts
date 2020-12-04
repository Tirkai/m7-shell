import { IPerformanceMode } from "interfaces/performance/IPerformanceMode";
import { DefaultPerformanceMode } from "models/DefaultPerformanceMode";
import React from "react";

interface IPerformanceContextOptions {
    mode: IPerformanceMode;
}

export const PerformanceContext = React.createContext<
    IPerformanceContextOptions
>({
    mode: new DefaultPerformanceMode(),
});
