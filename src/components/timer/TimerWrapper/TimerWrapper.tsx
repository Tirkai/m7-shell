import React, { Fragment, useEffect, useState } from "react";

interface ITimerWrapperProps {
    direction?: "forward" | "backward";
    onDone: () => void;
    ms: number;
    checkInterval?: number;
    children: (options: ITimerWrapperChildren) => React.ReactNode;
}

interface ITimerWrapperChildren {
    progress: number;
    msPassed: number;
}

export const TimerWrapper = (props: ITimerWrapperProps) => {
    const checkInterval = props.checkInterval ?? 1000;
    const direction = props.direction ?? "forward";

    // const [progress, setProgress] = useState(0);
    const [msPassed, setMsPassed] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setMsPassed((p) => {
                if (p >= props.ms) {
                    return p;
                }
                return p + checkInterval;
            });
        }, checkInterval);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        if (direction === "forward") {
            setProgress((msPassed * 100) / props.ms);
        }
        if (direction === "backward") {
            setProgress(100 - (msPassed * 100) / props.ms);
        }

        if (msPassed >= props.ms) {
            props.onDone();
        }
    }, [msPassed]);

    return <Fragment>{props.children({ msPassed, progress })}</Fragment>;
};
