import React, { useEffect } from "react";
import style from "./style.module.css";

interface IPlatformTitleProps {
    title: string;
}

const className = style.platformTitle;

export const PlatformTitle = (props: IPlatformTitleProps) => {
    useEffect(() => {
        document.title = props.title;
    }, [props.title]);

    return <></>;
};
