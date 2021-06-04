import { Point2D } from "models/Point2D";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import style from "./style.module.css";

interface IHintProps {
    title: React.ReactNode;
    position: Point2D;
}

const className = style.hint;

export const Hint = (props: IHintProps) => {
    const [container] = useState(document.createElement("div"));

    useEffect(() => {
        document.body.appendChild(container);
        return () => {
            document.body.removeChild(container);
        };
    }, []);

    return ReactDOM.createPortal(
        <div
            className={style.attachmentPoint}
            style={{ left: props.position.x, top: props.position.y }}
        >
            <div className={className}>
                <div className={style.container}>{props.title}</div>
            </div>
        </div>,
        container,
    );
};
