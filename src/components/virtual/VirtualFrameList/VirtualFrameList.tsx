import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.css";

interface IVirtualFrameListProps {
    children: React.ReactNode;
    count: number;
}

const className = style.virtualFrameList;

export const VirtualFrameList = (props: IVirtualFrameListProps) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [lastCount, setLastCount] = useState(props.count);

    useEffect(() => {
        if (lastCount < props.count) {
            const scrollTarget = scrollRef.current;
            const containerTarget = containerRef.current;

            if (scrollTarget && containerTarget) {
                const bounds = containerTarget.getBoundingClientRect();

                scrollTarget.scrollTo({
                    left: bounds.width,
                    behavior: "smooth",
                });
            }
        }
        setLastCount(props.count);
    }, [props.count]);

    return (
        <div className={className} ref={scrollRef}>
            <div
                className={style.container}
                ref={containerRef}
                style={{ gridTemplateColumns: `repeat(${props.count}, 250px)` }}
            >
                {props.children}
            </div>
        </div>
    );
};
