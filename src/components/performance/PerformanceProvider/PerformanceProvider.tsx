import { PerformanceContext } from "contexts/PerformanceContext";
import { IPerformanceMode } from "interfaces/performance/IPerformanceMode";
import { DefaultPerformanceMode } from "models/performance/DefaultPerformanceMode";
import { PerformanceModeType } from "models/performance/PerformanceModeType";
import { PotatoPerformanceMode } from "models/performance/PotatoPerformanceMode";
import React, { useEffect, useState } from "react";

interface IPerformanceProviderProps {
    mode: PerformanceModeType;
    children: React.ReactNode;
}

export const PerformanceProvider = (props: IPerformanceProviderProps) => {
    const [perfMode, setPerfMode] = useState<IPerformanceMode>(
        new DefaultPerformanceMode(),
    );

    useEffect(() => {
        let perf: IPerformanceMode;
        switch (props.mode) {
            case PerformanceModeType.Low:
                perf = new PotatoPerformanceMode();
                break;
            default:
                perf = new DefaultPerformanceMode();
        }

        if (!perf.enableAnimation) {
            document.body.classList.add("no-animate");

            setPerfMode(perf);
        }
    }, [props.mode]);

    return (
        <PerformanceContext.Provider value={{ mode: perfMode }}>
            {props.children}
        </PerformanceContext.Provider>
    );
};
